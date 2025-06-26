import HistoryArticle from '../models/HistoryArticle.js';

const getAll = async () => {
    return await HistoryArticle.find();
};

const getById = async (id) => {
    return await HistoryArticle.findById(id);
};

const createHistoryArticle = async (data) => {
    try {
      const { idUser, idArticle, action } = data;

      const existingRecord = await HistoryArticle.findOne({
        idUser,
        idArticle,
        action,
      });
  
      if (existingRecord) {
        return null; 
      }
  
      const existingActions = await HistoryArticle.find({
        idUser,
        idArticle,
        action: { $in: ['View', 'Like'] },
      });
  
      if (existingActions.length >= 2) {
        return null; 
      }
  
      // Tạo bản ghi mới
      return await HistoryArticle.create(data);
    } catch (error) {
      console.error('Lỗi trong service createHistoryArticle:', error);
      throw new Error(error.message || 'Lỗi khi tạo bản ghi lịch sử bài viết');
    }
  };

const updateHistoryArticleById = async (id, data) => {
    return await HistoryArticle.findByIdAndUpdate(id, data, { new: true })
}

const updateAllHistoryArticles = async (data) => {
    return await HistoryArticle.updateMany({}, data, { new: true })
}

const deleteHistoryArticleById = async (id) => {
    return await HistoryArticle.findByIdAndDelete(id)
}

const historyArticleService = {
    getAll,
    getById,
    createHistoryArticle,
    updateHistoryArticleById,
    updateAllHistoryArticles,
    deleteHistoryArticleById,
}

export default historyArticleService;