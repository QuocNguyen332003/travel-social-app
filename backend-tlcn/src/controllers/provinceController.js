import provinceService from '../services/provinceService.js'

const getProvinces = async (req, res) => {
  try {
    const Provinces = await provinceService.getAll()
    res.status(200).json({ success: true, data: Provinces, message: 'Lấy danh sách tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getAllNotPage = async (req, res) => {
  try {
    const Provinces = await provinceService.getAllNotPage()
    res.status(200).json({ success: true, data: Provinces, message: 'Lấy danh sách tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}


const getProvinceById = async (req, res) => {
  try {
    const Province = await provinceService.getById(req.params.id)
    if (!Province) return res.status(404).json({ success: false, data: null, message: 'Tỉnh không tồn tại' })
    res.status(200).json({ success: true, data: Province, message: 'Lấy tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createProvince = async (req, res) => {
  try {
    const newProvince = await provinceService.createProvince(req.body)
    res.status(201).json({ success: true, data: newProvince, message: 'Tạo tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateProvinceById = async (req, res) => {
  try {
    const updatedProvince = await provinceService.updateProvinceById(req.params.id, req.body)
    if (!updatedProvince) return res.status(404).json({ success: false, data: null, message: 'Tỉnh không tồn tại' })
    res.status(200).json({ success: true, data: updatedProvince, message: 'Cập nhật tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllProvinces = async (req, res) => {
  try {
    const updatedProvinces = await provinceService.updateAllProvinces(req.body)
    res.status(200).json({ success: true, data: updatedProvinces, message: 'Cập nhật tất cả tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteProvinceById = async (req, res) => {
  try {
    const deletedProvince = await provinceService.deleteProvinceById(req.params.id)
    if (!deletedProvince) return res.status(404).json({ success: false, data: null, message: 'Tỉnh không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa tỉnh thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const addNewPage = async (req, res) => {
  try {
    const result = await provinceService.addNewPage(req.params.id, req.body.pageId)
    if (!result) return res.status(404).json({ success: false, data: null, message: 'Tỉnh không tồn tại' })
    res.status(200).json({ success: true, data: result, message: 'Thêm trang thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getArticleOfPage = async (req, res) => {
  try {
    const result = await provinceService.getArticleOfPage(req.params.id, req.query.limit, req.query.skip)
    if (!result.success) return res.status(404).json({ success: false, data: null, message: 'Tỉnh không tồn tại' })
    res.status(200).json({ success: true, data: result.data, message: 'Thêm trang thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getHotPage = async (req, res) => {
  try {
    const result = await provinceService.getHotPage(req.params.id, req.query.limit, req.query.skip)
    if (!result) return res.status(404).json({ success: false, data: null, message: 'Tỉnh không tồn tại' })
    res.status(200).json({ success: true, data: result, message: 'Thêm trang thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getAllPage = async (req, res) => {
  try {
    const result = await provinceService.getAllPage(req.params.id, req.query.limit, req.query.skip)
    if (!result) return res.status(404).json({ success: false, data: null, message: 'Tỉnh không tồn tại' })
    res.status(200).json({ success: true, data: result, message: 'Thêm trang thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const ProvinceController = {
  getProvinces,
  getProvinceById,
  createProvince,
  updateProvinceById,
  updateAllProvinces,
  deleteProvinceById,
  addNewPage,
  getArticleOfPage,
  getHotPage,
  getAllNotPage,
  getAllPage
}

export  default ProvinceController;