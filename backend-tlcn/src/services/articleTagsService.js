import ArticleTags from '../models/ArticleTags.js';
import Article from '../models/Article.js';
import mongoose from 'mongoose';
import axios from 'axios';

const getArticleTags = async () => {
  return await ArticleTags.find({});
};

const getArticleTagById = async (id) => {
  return await ArticleTags.findOne({ _id: id, _destroy: null });
};

const createArticleTag = async (data) => {
  return await ArticleTags.create(data);
};

const updateArticleTagById = async (id, data) => {
  return await ArticleTags.findByIdAndUpdate(id, data, { new: true });
};

const updateAllArticleTags = async (data) => {
  return await ArticleTags.updateMany({}, data, { new: true });
};

const deleteArticleTagById = async (id) => {
  return await ArticleTags.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

const createArticleTagByArticle = async (article, uploadedMedia) => {
  try {
    const content = article.content;
    const listImages = uploadedMedia
    .filter((photo) => photo.type === 'img' && typeof photo.url === 'string' && photo.url.trim() !== '')
    .map((photo) => photo.url);

    const apiUrl = 'https://flask-api-service-336992372781.asia-southeast1.run.app/classify-url-avg';
    const response = await axios.post(apiUrl, {
      text: content,
      image_urls: listImages
    });

    const { text: textTags, images: imageTags } = response.data;

    const articleTag = await ArticleTags.create({
      idArticle: article._id,
      textTag: textTags,
      imagesTag: imageTags
    });

    return { success: true, data: articleTag };
  } catch (error) {
    console.error('Lỗi khi tạo ArticleTag:', error);
    return { success: false, message: 'Đã xảy ra lỗi khi xử lý.', error: error.message };
  }
};

const createArticleTagByArticleId = async (articleId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return { success: false, message: 'ID bài viết không hợp lệ!' };
    }
    const article = await Article.findById(articleId).populate('listPhoto');
    if (!article) {
      return { success: false, message: 'Không tồn tại bài viết với id tương ứng!' };
    }
    const existingTag = await ArticleTags.findOne({ idArticle: articleId });
    if (existingTag) {
      return { success: false, message: 'ArticleTag đã tồn tại cho bài viết này!' };
    }
    
    const content = article.content;
    const listImages = article.listPhoto
    .filter((photo) => photo.type === 'img' && typeof photo.url === 'string' && photo.url.trim() !== '')
    .map((photo) => photo.url);

    const apiUrl = 'https://flask-api-service-336992372781.asia-southeast1.run.app/classify-url-avg';
    const response = await axios.post(apiUrl, {
      text: content,
      image_urls: listImages
    });

    const { text: textTags, images: imageTags } = response.data;

    const articleTag = await ArticleTags.create({
      idArticle: article._id,
      textTag: textTags,
      imagesTag: imageTags
    });

    return { success: true, data: articleTag };
  } catch (error) {
    console.error('Lỗi khi tạo ArticleTag:', error);
    return { success: false, message: 'Đã xảy ra lỗi khi xử lý.', error: error.message };
  }
};

export const articleTagsService = {
  getArticleTags,
  getArticleTagById,
  createArticleTag,
  updateArticleTagById,
  updateAllArticleTags,
  deleteArticleTagById,
  createArticleTagByArticleId,
  createArticleTagByArticle
};
