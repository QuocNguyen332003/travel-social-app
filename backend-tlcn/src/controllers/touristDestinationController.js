import touristDestinationService from "../services/touristDestinationService.js"

const getTouristDestinations = async (req, res) => {
  try {
    const TouristDestinations = await touristDestinationService.getAll()
    res.status(200).json({ success: true, data: TouristDestinations, message: 'Lấy danh sách điểm du lịch thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getTouristDestinationById = async (req, res) => {
  try {
    const TouristDestination = await touristDestinationService.getById(req.params.id)
    if (!TouristDestination) return res.status(404).json({ success: false, data: null, message: 'Điểm du lịch không tồn tại' })
    res.status(200).json({ success: true, data: TouristDestination, message: 'Lấy điểm du lịch thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createTouristDestination = async (req, res) => {
  try {
    const newTouristDestination = await touristDestinationService.createTouristDestination(req.body)
    res.status(201).json({ success: true, data: newTouristDestination, message: 'Tạo điểm du lịch thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateTouristDestinationById = async (req, res) => {
  try {
    const updatedTouristDestination = await touristDestinationService.updateTouristDestinationById(req.params.id, req.body)
    if (!updatedTouristDestination) return res.status(404).json({ success: false, data: null, message: 'Điểm du lịch không tồn tại' })
    res.status(200).json({ success: true, data: updatedTouristDestination, message: 'Cập nhật điểm du lịch thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllTouristDestinations = async (req, res) => {
  try {
    const updatedTouristDestinations = await touristDestinationService.updateAllTouristDestinations(req.body)
    res.status(200).json({ success: true, data: updatedTouristDestinations, message: 'Cập nhật tất cả điểm du lịch thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteTouristDestinationById = async (req, res) => {
  try {
    const deletedTouristDestination = await touristDestinationService.deleteTouristDestinationById(req.params.id)
    if (!deletedTouristDestination) return res.status(404).json({ success: false, data: null, message: 'Điểm du lịch không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa điểm du lịch thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createTouristDestinationByPageId = async (req, res) => {
  try {
    const { pageId } = req.body;
    const result = await touristDestinationService.createTouristDestinationByPageId(pageId)
    if (!result.success) 
      return res.status(400).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result.data, message: 'Tạo điểm du lịch thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const TouristDestinationController = {
  getTouristDestinations,
  getTouristDestinationById,
  createTouristDestination,
  updateTouristDestinationById,
  updateAllTouristDestinations,
  deleteTouristDestinationById,
  createTouristDestinationByPageId
}

export  default TouristDestinationController;