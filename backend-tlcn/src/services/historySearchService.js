// historySearchService.js
import HistorySearch from "../models/HistorySearch.js";

const getHistorySearches = async () => {
  return await HistorySearch.find({ _destroy: null });
};

const getHistorySearchById = async (id) => {
  return await HistorySearch.findOne({ _id: id, _destroy: null });
};

const createHistorySearch = async (data) => {
  return await HistorySearch.create(data);
};

const updateHistorySearchById = async (id, data) => {
  return await HistorySearch.findByIdAndUpdate(id, data, { new: true });
};

const updateAllHistorySearches = async (data) => {
  return await HistorySearch.updateMany({}, data, { new: true });
};

const deleteHistorySearchById = async (id) => {
  return await HistorySearch.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

const addHistorySearch = async (idUser, keySearch) => {
  // Tìm bản ghi với idUser
  const existingHistorySearch = await HistorySearch.findOne({ idUser, _destroy: null });

  if (existingHistorySearch) {
    // Loại bỏ keySearch nếu đã tồn tại để tránh trùng lặp
    const updatedKeySearch = existingHistorySearch.keySearch.filter(
      (item) => item !== keySearch
    );
    // Thêm keySearch mới vào đầu mảng
    updatedKeySearch.unshift(keySearch);
    existingHistorySearch.keySearch = updatedKeySearch;
    return await existingHistorySearch.save();
  }

  // Nếu không tồn tại, tạo mới bản ghi với keySearch là mảng chỉ chứa một mục
  const newHistorySearch = await createHistorySearch({
    idUser,
    keySearch: [keySearch],
  });
  return newHistorySearch;
};

const getHistorySearchByIdUser = async (idUser) => {
  return await HistorySearch.findOne({ idUser, _destroy: null });
};

const updateHistorySearchByIdUser = async (idUser, keySearch) => {
  return await HistorySearch.findOneAndUpdate(
    { idUser, _destroy: null }, // Tìm bản ghi theo idUser và chưa bị xóa mềm
    { keySearch }, // Cập nhật mảng keySearch mới
    { new: true, upsert: true } // Trả về bản ghi mới, tạo mới nếu không tồn tại
  );
};

export const historySearchService = {
  getHistorySearches,
  getHistorySearchById,
  createHistorySearch,
  updateHistorySearchById,
  updateAllHistorySearches,
  deleteHistorySearchById,
  addHistorySearch,
  getHistorySearchByIdUser,
  updateHistorySearchByIdUser,
};