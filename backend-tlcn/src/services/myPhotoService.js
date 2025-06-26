import MyPhoto from "../models/MyPhoto.js";
import { cloudStorageService } from "../config/cloudStorage.js";
import User from "../models/User.js";

const getMyPhotos = async (filter) => {
  const query = { _destroy: null, ...(filter || {}) };
  return await MyPhoto.find(query);
};

const getMyPhotoById = async (id) => {
  return await MyPhoto.findOne({ _id: id, _destroy: null })
};


const createMyPhoto = async (data) => {
  return await MyPhoto.create(data);
};

const updateMyPhotoById = async (id, data) => {
  return await MyPhoto.findByIdAndUpdate(id, data, { new: true })
};

const updateAllMyPhotos = async (data) => {
  return await MyPhoto.updateMany({}, data, { new: true });
};

const deleteMyPhotoById = async (id) => {
  return await MyPhoto.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

const uploadAndSaveFile = async (file, userId, type, folderType, referenceId) => {
  try {
    if (!file || !file.buffer) {
      console.error("Invalid file provided for upload");
      throw new Error("Không có file hợp lệ để upload!");
    }

    const fileName = `${referenceId}_${Date.now()}`;
    const destination = `srcv2/images/${folderType}/${referenceId}/${fileName}`;

    // Upload file to GCS
    const fileUrl = await cloudStorageService.uploadImageBufferToStorage(
      file.buffer,
      destination,
      file.mimetype
    );

    if (!fileUrl) {
      console.error("Failed to get URL after upload");
      throw new Error("Không lấy được URL sau khi upload!");
    }

    // Create new MyPhoto document
    const newFile = await MyPhoto.create({
      name: file.originalname,
      idAuthor: userId,
      type: type,
      url: fileUrl,
    });

    return newFile;
  } catch (error) {
    console.error("❌ Lỗi khi lưu file:", error);
    throw error;
  }
};

const getMyPhotosAndUser = async (userId, query) => {
  const filter = { _destroy: null, idAuthor: userId };

  if (query.type) {
    filter.type = query.type;
  }

  const photos = await MyPhoto.find(filter);
  const user = await User.findById(userId).select('displayName _id avt');
  
  const filteredPhotos = user.avt?.length
    ? photos.filter((photo) => !user.avt.includes(photo._id.toString()))
    : photos;

  return filteredPhotos.map((item) => ({
    ...item.toObject(),
    idAuthor: user,
  }));
  
};



export const myPhotoService = {
  getMyPhotos,
  getMyPhotoById,
  createMyPhoto,
  updateMyPhotoById,
  updateAllMyPhotos,
  deleteMyPhotoById,
  uploadAndSaveFile,
  getMyPhotosAndUser
};
