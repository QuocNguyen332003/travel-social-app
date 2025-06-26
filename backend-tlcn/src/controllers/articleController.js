import { articleService } from '../services/articleService.js';
import mongoose from 'mongoose';
import { emitEvent } from "../socket/socket.js";

const getArticles = async (req, res) => {
  try {
    const { $limit = 5, $skip = 0, createdBy, groupID, isDeleted, hasReports, hashtag, province } = req.query;
    const filter = {};

    // Lọc theo hashtag (hashtag luôn là mảng)
    if (hashtag) {
      let hashtagArray;
      if (typeof hashtag === 'string') {
        // Xử lý hashtag dạng chuỗi: "#nhatrang,#dalat" -> ["#nhatrang", "#dalat"]
        hashtagArray = hashtag
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.startsWith('#') && tag.length > 1);
      } else if (Array.isArray(hashtag) && hashtag.length > 0) {
        // Xử lý hashtag dạng mảng: ["#nhatrang", "#dalat"]
        hashtagArray = hashtag.filter(tag => tag.startsWith('#') && tag.length > 1);
      }
      if (hashtagArray && hashtagArray.length > 0) {
        filter.hashTag = { $in: hashtagArray }; // Giữ nguyên #
      }
    }

    // Lọc theo người tạo
    if (createdBy) filter.createdBy = createdBy;

    // Lọc theo nhóm
    if (groupID) filter.groupID = groupID;

    // Lọc bài viết đã xóa hoặc chưa xóa
    if (isDeleted === 'true') {
      filter._destroy = { $ne: null };
    } else if (isDeleted === 'false') {
      filter._destroy = null;
    }

    // Lọc bài viết có báo cáo
    if (hasReports === 'true') {
      filter['reports.0'] = { $exists: true };
    }

    const { articles, total } = await articleService.getArticles({
      limit: parseInt($limit),
      skip: parseInt($skip),
      filter,
      province, // Pass province to the service
    });

    res.status(200).json({
      success: true,
      data: articles,
      total,
      message: 'Lấy danh sách bài viết thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await articleService.getArticleById(req.params.id);
    if (!article) return res.status(404).json({ success: false, data: null, message: 'Bài viết không tồn tại' });
    res.status(200).json({ success: true, data: article, message: 'Lấy bài viết thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createArticle = async (req, res) => {
  try {

    const result = await articleService.createArticle(req.body, req.files);

    res.status(201).json({
      success: true,
      data: result.article, // Trả về bài viết
      backendProcessingTime: result.backendProcessingTime,
      message: "Tạo bài viết thành công",
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo bài viết:", error);
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};



const updateArticleById = async (req, res) => {
  try {
    const updatedArticle = await articleService.updateArticleById(req.params.id, req.body);
    if (!updatedArticle) return res.status(404).json({ success: false, data: null, message: 'Bài viết không tồn tại' });
    res.status(200).json({ success: true, data: updatedArticle, message: 'Cập nhật bài viết thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllArticles = async (req, res) => {
  try {
    const updatedArticles = await articleService.updateAllArticles(req.body);
    res.status(200).json({ success: true, data: updatedArticles, message: 'Cập nhật tất cả bài viết thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteArticleById = async (req, res) => {
  try {
    const deletedArticle = await articleService.deleteArticleById(req.params.id);
    if (!deletedArticle) return res.status(404).json({ success: false, data: null, message: 'Bài viết không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa bài viết thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { userId } = req.body;

    console.log(`ToggleLike: articleId=${articleId}, userId=${userId}`);

    if (!userId) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'userId là bắt buộc',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      console.error(`Invalid articleId: ${articleId}`);
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Invalid articleId',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error(`Invalid userId: ${userId}`);
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Invalid userId',
      });
    }

    const updatedArticle = await articleService.toggleLike(articleId, userId);

    // Serialize emoticons to strings
    const serializedArticle = {
      ...updatedArticle.toObject(),
      emoticons: updatedArticle.emoticons.map((id) => id.toString()),
    };

    emitEvent("post", articleId, "articleLiked", {
      articleId,
      emoticons: updatedArticle.emoticons.map((id) => id.toString()),
      userId,
    });

    res.status(200).json({
      success: true,
      data: serializedArticle,
      message: 'Thao tác like/unlike thành công',
    });
  } catch (error) {
    console.error('ToggleLike error:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Đã xảy ra lỗi khi thích bài viết',
    });
  }
};


const getCommentsByArticleId = async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await articleService.getCommentsByArticleId(articleId);

    res.status(200).json({
      success: true,
      data: comments,
      message: "Lấy danh sách bình luận thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getArticlesByProvinceId = async (req, res) => {
  try {
    const { provinceId } = req.params;
    const { $limit = 1, $skip = 0 } = req.query;

    const { articles, total } = await articleService.getArticlesByProvinceId({
      provinceId,
      limit: parseInt($limit),
      skip: parseInt($skip),
    });

    if (!articles || articles.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Không tìm thấy bài viết cho tỉnh/thành phố này',
      });
    }

    res.status(200).json({
      success: true,
      data: articles,
      total,
      message: 'Lấy danh sách bài viết thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};



export const articleController = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticleById,
  updateAllArticles,
  deleteArticleById,
  toggleLike,
  getCommentsByArticleId,
  getArticlesByProvinceId
};
