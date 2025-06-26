import historyViewPageService from '../services/historyViewPageService.js'

const getHistoryViewPages = async (req, res) => {
  try {
    const HistoryViewPages = await historyViewPageService.getAll()
    res.status(200).json({ success: true, data: HistoryViewPages, message: 'Lấy danh sách lịch sử xem trang thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getHistoryViewPageById = async (req, res) => {
  try {
    const HistoryViewPage = await historyViewPageService.getById(req.params.id)
    if (!HistoryViewPage) return res.status(404).json({ success: false, data: null, message: 'Lịch sử trang không tồn tại' })
    res.status(200).json({ success: true, data: HistoryViewPage, message: 'Lấy lịch sử xem trang thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createHistoryViewPage = async (req, res) => {
  try {
    const newHistoryViewPage = await historyViewPageService.createHistoryViewPage(req.body)
    res.status(201).json({ success: true, data: newHistoryViewPage, message: 'Tạo lịch sử xem trang thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateHistoryViewPageById = async (req, res) => {
  try {
    const updatedHistoryViewPage = await historyViewPageService.updateHistoryViewPageById(req.params.id, req.body)
    if (!updatedHistoryViewPage) return res.status(404).json({ success: false, data: null, message: 'Lịch sử trang không tồn tại' })
    res.status(200).json({ success: true, data: updatedHistoryViewPage, message: 'Cập nhật lịch sử xem trang thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllHistoryViewPages = async (req, res) => {
  try {
    const updatedHistoryViewPages = await historyViewPageService.updateAllHistoryViewPages(req.body)
    res.status(200).json({ success: true, data: updatedHistoryViewPages, message: 'Cập nhật tất cả lịch sử xem trang thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteHistoryViewPageById = async (req, res) => {
  try {
    const deletedHistoryViewPage = await historyViewPageService.deleteHistoryViewPageById(req.params.id)
    if (!deletedHistoryViewPage) return res.status(404).json({ success: false, data: null, message: 'Lịch sử trang không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa lịch sử xem trang thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getViewByUserId = async (req, res) => {
  try {
    const result = await historyViewPageService.getViewByUserId(req.params.id)
    if (!result) return res.status(404).json({ success: false, data: null, message: 'Lịch sử trang không tồn tại' })
    res.status(200).json({ success: true, data: result, message: 'Lấy danh sách xem gần đây thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const HistoryViewPageController = {
  getHistoryViewPages,
  getHistoryViewPageById,
  createHistoryViewPage,
  updateHistoryViewPageById,
  updateAllHistoryViewPages,
  deleteHistoryViewPageById,
  getViewByUserId
}

export  default HistoryViewPageController;