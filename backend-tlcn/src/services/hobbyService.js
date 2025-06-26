import Hobby from "../models/Hobby.js";

const getHobbies = async () => {
  return await Hobby.find({ _destroy: null });
};

const getHobbyById = async (id) => {
  return await Hobby.findOne({ _id: id, _destroy: null });
};

const createHobby = async (data) => {
  return await Hobby.create(data);
};

const updateHobbyById = async (id, data) => {
  return await Hobby.findByIdAndUpdate(id, data, { new: true });
};

const updateAllHobbies = async (data) => {
  return await Hobby.updateMany({}, data, { new: true });
};

const deleteHobbyById = async (id) => {
  return await Hobby.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

export const hobbyService = {
  getHobbies,
  getHobbyById,
  createHobby,
  updateHobbyById,
  updateAllHobbies,
  deleteHobbyById,
};
