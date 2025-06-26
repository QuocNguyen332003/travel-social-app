import historyArticleService from '../services/historyArticleService.js'

const getHistoryArticles = async (req, res) => {
  try {
    const HistoryArticles = await historyArticleService.getAll()
    res.status(200).json({ success: true, data: HistoryArticles, message: 'Lấy danh sách lịch sử bài viết thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getHistoryArticleById = async (req, res) => {
  try {
    const HistoryArticle = await historyArticleService.getById(req.params.id)
    if (!HistoryArticle) return res.status(404).json({ success: false, data: null, message: 'Lịch sử bài viết không tồn tại' })
    res.status(200).json({ success: true, data: HistoryArticle, message: 'Lấy lịch sử bài viết thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createHistoryArticle = async (req, res) => {
  try {
    const { idUser, idArticle, action } = req.body;

    if (!idUser || !idArticle || !action) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Thiếu các trường bắt buộc: idUser, idArticle, action',
      });
    }

    if (!['View', 'Like'].includes(action)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Hành động không hợp lệ. Phải là View hoặc Like',
      });
    }

    // Gọi service để kiểm tra và tạo bản ghi
    const newHistoryArticle = await historyArticleService.createHistoryArticle(req.body);

    if (!newHistoryArticle) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'Bản ghi đã tồn tại hoặc không cần tạo mới',
      });
    }

    res.status(201).json({
      success: true,
      data: newHistoryArticle,
      message: 'Tạo lịch sử bài viết thành công',
    });
  } catch (error) {
    console.error('Lỗi khi tạo bản ghi lịch sử:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || 'Lỗi server khi tạo bản ghi lịch sử',
    });
  }
};

const updateHistoryArticleById = async (req, res) => {
  try {
    const updatedHistoryArticle = await historyArticleService.updateHistoryArticleById(req.params.id, req.body)
    if (!updatedHistoryArticle) return res.status(404).json({ success: false, data: null, message: 'Lịch sử bài viết không tồn tại' })
    res.status(200).json({ success: true, data: updatedHistoryArticle, message: 'Cập nhật lịch sử bài viết thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllHistoryArticles = async (req, res) => {
  try {
    const updatedHistoryArticles = await historyArticleService.updateAllHistoryArticles(req.body)
    res.status(200).json({ success: true, data: updatedHistoryArticles, message: 'Cập nhật tất cả lịch sử bài viết thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteHistoryArticleById = async (req, res) => {
  try {
    const deletedHistoryArticle = await historyArticleService.deleteHistoryArticleById(req.params.id)
    if (!deletedHistoryArticle) return res.status(404).json({ success: false, data: null, message: 'Lịch sử bài viết không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa lịch sử bài viết thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const HistoryArticleController = {
  getHistoryArticles,
  getHistoryArticleById,
  createHistoryArticle,
  updateHistoryArticleById,
  updateAllHistoryArticles,
  deleteHistoryArticleById,
}

export  default HistoryArticleController;