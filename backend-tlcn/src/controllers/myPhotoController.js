import { myPhotoService } from "../services/myPhotoService.js";

const getMyPhotos = async (req, res) => {
  try {
    const myPhotos = await myPhotoService.getMyPhotos(req.query);
    res.status(200).json({ success: true, data: myPhotos, message: 'Lấy danh sách ảnh/video/ghi âm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getMyPhotoById = async (req, res) => {
  try {
    const myPhoto = await myPhotoService.getMyPhotoById(req.params.id);
    if (!myPhoto) return res.status(404).json({ success: false, data: null, message: 'Ảnh/video/ghi âm không tồn tại' });
    res.status(200).json({ success: true, data: myPhoto, message: 'Lấy ảnh/video/ghi âm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createMyPhoto = async (req, res) => {
  try {
    const newMyPhoto = await myPhotoService.createMyPhoto(req.body);
    res.status(201).json({ success: true, data: newMyPhoto, message: 'Tạo ảnh/video/ghi âm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateMyPhotoById = async (req, res) => {
  try {
    const updatedMyPhoto = await myPhotoService.updateMyPhotoById(req.params.id, req.body);
    if (!updatedMyPhoto) return res.status(404).json({ success: false, data: null, message: 'Ảnh/video/ghi âm không tồn tại' });
    res.status(200).json({ success: true, data: updatedMyPhoto, message: 'Cập nhật ảnh/video/ghi âm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllMyPhotos = async (req, res) => {
  try {
    const updatedMyPhotos = await myPhotoService.updateAllMyPhotos(req.body);
    res.status(200).json({ success: true, data: updatedMyPhotos, message: 'Cập nhật tất cả ảnh/video/ghi âm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteMyPhotoById = async (req, res) => {
  try {
    const deletedMyPhoto = await myPhotoService.deleteMyPhotoById(req.params.id);
    if (!deletedMyPhoto) return res.status(404).json({ success: false, data: null, message: 'Ảnh/video/ghi âm không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa ảnh/video/ghi âm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const uploadFile = async (req, res) => {
  try {

    const { idAuthor, type, folderType, referenceId } = req.body;

    if (!idAuthor || !type || !folderType || !referenceId) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Không có file nào được tải lên' });
    }

    const newFile = await myPhotoService.uploadAndSaveFile(req.file, idAuthor, type, folderType, referenceId);

    res.status(201).json({ success: true, data: newFile, message: 'Upload file thành công' });
  } catch (error) {
    console.error("❌ Lỗi khi upload file:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const getMyPhotosAndUser = async (req, res) => {
  try {
    const myPhotos = await myPhotoService.getMyPhotosAndUser(req.params.id, req.query);
    res.status(200).json({ success: true, data: myPhotos, message: 'Lấy danh sách ảnh/video/ghi âm thành công theo user' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

export const myPhotoController = {
  getMyPhotos,
  getMyPhotoById,
  createMyPhoto,
  updateMyPhotoById,
  updateAllMyPhotos,
  deleteMyPhotoById,
  uploadFile,
  getMyPhotosAndUser
};
