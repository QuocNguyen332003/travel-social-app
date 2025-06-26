import { identificationService } from '../services/identificationService.js';

const getIdentifications = async (req, res) => {
  try {
    const identifications = await identificationService.getIdentifications();
    res.status(200).json({ success: true, data: identifications, message: 'Lấy danh sách chứng minh thư thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getIdentificationById = async (req, res) => {
  try {
    const identification = await identificationService.getIdentificationById(req.params.id);
    if (!identification) return res.status(404).json({ success: false, data: null, message: 'Chứng minh thư không tồn tại' });
    res.status(200).json({ success: true, data: identification, message: 'Lấy chứng minh thư thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};


const createIdentification = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Không có file được tải lên' });
    }
    const imageBuffer = req.file.buffer;
    const newIdentification = await identificationService.createIdentification(imageBuffer);
    res.status(201).json({ success: true, data: newIdentification, message: 'Tạo chứng minh thư thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateIdentificationById = async (req, res) => {
  try {
    const updatedIdentification = await identificationService.updateIdentificationById(req.params.id, req.body);
    if (!updatedIdentification) return res.status(404).json({ success: false, data: null, message: 'Chứng minh thư không tồn tại' });
    res.status(200).json({ success: true, data: updatedIdentification, message: 'Cập nhật chứng minh thư thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllIdentifications = async (req, res) => {
  try {
    const updatedIdentifications = await identificationService.updateAllIdentifications(req.body);
    res.status(200).json({ success: true, data: updatedIdentifications, message: 'Cập nhật tất cả chứng minh thư thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteIdentificationById = async (req, res) => {
  try {
    const deletedIdentification = await identificationService.deleteIdentificationById(req.params.id);
    if (!deletedIdentification) return res.status(404).json({ success: false, data: null, message: 'Chứng minh thư không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa chứng minh thư thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};
const extractCCCD = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Không có file được tải lên' });
    }
    const imageBuffer = req.file.buffer;
    const cccdData = await identificationService.extractCCCDData(imageBuffer);
    res.status(200).json({ success: true, data: cccdData, message: 'Trích xuất dữ liệu CCCD thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};
export const identificationController = {
  getIdentifications,
  getIdentificationById,
  createIdentification,
  updateIdentificationById,
  updateAllIdentifications,
  deleteIdentificationById,
  extractCCCD
};
