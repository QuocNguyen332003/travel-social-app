// recommendationService.js
import User from '../models/User.js';
import Article from '../models/Article.js';
import HistoryArticle from '../models/HistoryArticle.js';
import ArticleTags from '../models/ArticleTags.js';
import Comment from '../models/Comment.js';
import mongoose from 'mongoose';

const filterArticlesByScope = async (userId, articles) => {
  const user = await User.findById(userId).populate('friends').lean();
  if (!user) return [];

  const friends = Array.isArray(user.friends) ? user.friends : [];

  return articles.filter(article => {
    if (!article.createdBy || !article.createdBy._id) {
      console.warn('Article missing createdBy or createdBy._id:', article._id);
      return false;
    }

    const scope = article.scope || 'Công khai';
    if (scope === 'Công khai') return true;
    if (
      scope === 'Bạn bè' &&
      friends.some(friend => friend._id.toString() === article.createdBy._id.toString())
    )
      return true;
    if (scope === 'Riêng tư' && article.createdBy._id.toString() === userId.toString()) return true;
    return false;
  });
};

// --- Content-Based Filtering (CBF) ---
const buildUserTagProfile = async (userId) => {
  const history = await HistoryArticle.find({ idUser: userId }).lean();
  const interactedArticleIds = history.map(h => h.idArticle);

  const userArticleTags = await ArticleTags.find({ idArticle: { $in: interactedArticleIds } }).lean();

  const tagProfile = {};

  userArticleTags.forEach(at => {
    at.textTag.forEach(tag => {
      tagProfile[tag] = (tagProfile[tag] || 0) + 1;
    });
    at.imagesTag.forEach(imgTag => {
      tagProfile[imgTag.tag] = (tagProfile[imgTag.tag] || 0) + imgTag.weight;
    });
  });

  return tagProfile;
};

// Tính điểm tương đồng tag giữa bài viết và profile user
const scoreArticleByTags = (articleTags, userTagProfile) => {
  if (!articleTags) return 0;
  let score = 0;
  articleTags.textTag.forEach(tag => {
    if (userTagProfile[tag]) score += userTagProfile[tag];
  });
  articleTags.imagesTag.forEach(imgTag => {
    if (userTagProfile[imgTag.tag]) score += userTagProfile[imgTag.tag] * imgTag.weight;
  });
  return score;
};

// --- Collaborative Filtering (CF) ---
const calculateCollaborativeScore = async (userId, articles, user) => {
  const friendIds = Array.isArray(user.friends) ? user.friends.map(f => f._id.toString()) : [];
  const followingIds = Array.isArray(user.following) ? user.following.map(f => f._id.toString()) : [];

  const interactedUsers = [userId, ...friendIds, ...followingIds];

  const interactions = await HistoryArticle.find({
    idUser: { $in: interactedUsers }
  }).lean();

  const scores = {};
  interactions.forEach(h => {
    const articleId = h.idArticle.toString();
    let baseScore = h.action === 'View' ? 1 : 2; // View cho điểm thấp hơn Like

    if (h.idUser.toString() === userId) baseScore *= 2; // User chính trọng số cao hơn
    else baseScore *= 0.5; // Bạn bè/following trọng số thấp hơn

    scores[articleId] = (scores[articleId] || 0) + baseScore;
  });

  return articles.reduce((acc, a) => {
    acc[a._id.toString()] = scores[a._id.toString()] || 0;
    return acc;
  }, {});
};

const recommend = async (userId, page = 1, limit = 10) => {
  const user = await User.findById(userId)
    .populate([
      'hobbies',
      'friends',
      'following',
      'groups.createGroups',
      'groups.saveGroups',
      'pages.createPages',
      'pages.followerPages',
    ])
    .lean();

  if (!user) throw new Error('Người dùng không tồn tại');

  let allArticles = await Article.find({ _destroy: null }).lean();
  if (!Array.isArray(allArticles)) {
    console.warn('No articles found or query failed');
    return {
      articles: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
      scoredArticlesDetails: [],
    };
  }

  allArticles = await filterArticlesByScope(userId, allArticles);

  if (!Array.isArray(allArticles) || allArticles.length === 0) {
    return {
      articles: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
      scoredArticlesDetails: [],
    };
  }

  const articleIds = allArticles.map(a => a._id);
  const articleTagsList = await ArticleTags.find({ idArticle: { $in: articleIds } }).lean();
  const articleTagsMap = new Map();
  articleTagsList.forEach(at => articleTagsMap.set(at.idArticle.toString(), at));

  const userTagProfile = await buildUserTagProfile(userId);

  const comments = await Comment.find({ _iduser: userId }).lean();
  const commentedArticleIds = comments
    .map(c => c.articleId)
    .filter(id => id != null)
    .map(id => id.toString());

  const COMMENT_BOOST = 5; // Điểm tăng thêm nếu user đã comment bài này
  const ALPHA = 0.6; // Trọng số cho Content-Based Filtering (0.6 * CBF + 0.4 * CF)

  // --- Các hằng số mới cho Time Decay và New Article Boost ---
  const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
  const DECAY_HALF_LIFE_DAYS = 30; // Thời gian để điểm giảm một nửa (30 ngày)
  const DECAY_RATE = Math.log(2) / DECAY_HALF_LIFE_DAYS; // Công thức tính tỷ lệ giảm

  const NEW_ARTICLE_BOOST = 50; // Điểm tăng thêm cho bài viết rất mới
  const NEW_ARTICLE_HOURS_LIMIT = 1; // Bài viết được coi là rất mới trong 1 giờ đầu tiên
  // --- Kết thúc các hằng số mới ---

  const collaborativeScores = await calculateCollaborativeScore(userId, allArticles, user);

  const scoredArticles = allArticles.map(article => {
    const idStr = article._id.toString();
    const at = articleTagsMap.get(idStr);

    const contentScore = scoreArticleByTags(at, userTagProfile);
    const collabScore = collaborativeScores[idStr] || 0;
    const commentScore = commentedArticleIds.includes(idStr) ? COMMENT_BOOST : 0;

    // --- Tính toán Time Decay ---
    const articleAgeMs = Date.now() - article.createdAt;
    const articleAgeDays = articleAgeMs / MILLISECONDS_IN_DAY;
    const decayFactor = Math.exp(-DECAY_RATE * articleAgeDays);
    // Đảm bảo decayFactor không giảm quá mức (ví dụ, không giảm quá 80%)
    const effectiveDecayFactor = Math.max(0.2, decayFactor); // Giảm tối đa 80% điểm gốc

    // --- Tính toán New Article Boost ---
    const articleAgeHours = articleAgeMs / (60 * 60 * 1000);
    const newArticleBoost = (articleAgeHours <= NEW_ARTICLE_HOURS_LIMIT) ? NEW_ARTICLE_BOOST : 0;
    // --- Kết thúc các tính toán mới ---

    // Tổng điểm cơ bản
    const baseScore = ALPHA * contentScore + (1 - ALPHA) * collabScore + commentScore;

    // Áp dụng Time Decay và New Article Boost
    const finalScore = baseScore * effectiveDecayFactor + newArticleBoost;

    return { 
      article, 
      score: finalScore, 
      detail: { 
        contentScore, 
        collabScore, 
        commentScore, 
        decayFactor: effectiveDecayFactor,
        newArticleBoost 
      } 
    };
  });

  // Sắp xếp toàn bộ bài viết theo điểm giảm dần
  scoredArticles.sort((a, b) => b.score - a.score);

  // Phân trang trên kết quả đã sắp xếp
  const totalArticlesCount = scoredArticles.length;
  const totalPages = Math.ceil(totalArticlesCount / limit);
  const startIndex = (page - 1) * limit;
  const pagedArticleScores = scoredArticles.slice(startIndex, startIndex + limit);

  // Lấy _id của các bài viết đã được phân trang và sắp xếp
  const finalArticleIds = pagedArticleScores.map(s => s.article._id);

  // Populate các bài viết đã chọn với tất cả các trường cần thiết
  const populatedArticles = await Article.find({ _id: { $in: finalArticleIds } })
    .populate({
      path: 'createdBy',
      select: '_id displayName avt',
      populate: {
        path: 'avt',
        select: '_id name idAuthor type url createdAt updatedAt',
      },
    })
    .populate({
      path: 'listPhoto',
      select: '_id name idAuthor type url createdAt updatedAt',
      populate: {
        path: 'idAuthor',
        select: '_id displayName avt',
      },
    })
    .populate({
      path: 'groupID',
      select: '_id groupName',
    })
    .populate({
      path: 'address',
      select: '_id province district ward street placeName lat long',
    })
    .lean();

  // Tạo một Map để giữ nguyên thứ tự sắp xếp theo điểm ban đầu
  const populatedArticlesMap = new Map(populatedArticles.map(art => [art._id.toString(), art]));
  const articlesInDesiredOrder = finalArticleIds.map(id => populatedArticlesMap.get(id.toString()));

  return {
    articles: articlesInDesiredOrder.filter(Boolean),
    total: totalArticlesCount,
    totalPages,
    currentPage: page,
    scoredArticlesDetails: pagedArticleScores.map(s => ({
      articleId: s.article._id.toString(),
      contentScore: s.detail.contentScore,
      collaborativeScore: s.detail.collabScore,
      commentScore: s.detail.commentScore,
      finalScore: s.score,
      decayFactor: s.detail.decayFactor, // Thêm vào để theo dõi
      newArticleBoost: s.detail.newArticleBoost, // Thêm vào để theo dõi
    })),
  };
};

export const recommendationService = {
  recommend,
};