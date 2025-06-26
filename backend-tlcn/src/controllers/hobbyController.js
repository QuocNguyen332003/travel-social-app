import { hobbyService } from "../services/hobbyService.js";

const getHobbies = async (req, res) => {
  try {
    const hobbies = await hobbyService.getHobbies();
    res.status(200).json({ success: true, data: hobbies, message: 'Lấy danh sách sở thích thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getHobbyById = async (req, res) => {
  try {
    const hobby = await hobbyService.getHobbyById(req.params.id);
    if (!hobby) return res.status(404).json({ success: false, data: null, message: 'Sở thích không tồn tại' });
    res.status(200).json({ success: true, data: hobby, message: 'Lấy sở thích thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createHobby = async (req, res) => {
  try {
    const newHobby = await hobbyService.createHobby(req.body);
    res.status(201).json({ success: true, data: newHobby, message: 'Tạo sở thích thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateHobbyById = async (req, res) => {
  try {
    const updatedHobby = await hobbyService.updateHobbyById(req.params.id, req.body);
    if (!updatedHobby) return res.status(404).json({ success: false, data: null, message: 'Sở thích không tồn tại' });
    res.status(200).json({ success: true, data: updatedHobby, message: 'Cập nhật sở thích thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllHobbies = async (req, res) => {
  try {
    const updatedHobbies = await hobbyService.updateAllHobbies(req.body);
    res.status(200).json({ success: true, data: updatedHobbies, message: 'Cập nhật tất cả sở thích thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteHobbyById = async (req, res) => {
  try {
    const deletedHobby = await hobbyService.deleteHobbyById(req.params.id);
    if (!deletedHobby) return res.status(404).json({ success: false, data: null, message: 'Sở thích không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa sở thích thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

export const hobbyController = {
  getHobbies,
  getHobbyById,
  createHobby,
  updateHobbyById,
  updateAllHobbies,
  deleteHobbyById,
};
