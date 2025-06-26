import Address from "../models/Address.js";

const getAddresses = async () => {
  return await Address.find({ _destroy: null });
};

const getAddressById = async (id) => {
  return await Address.findOne({ _id: id, _destroy: null });
};

const createAddress = async (data) => {
  return await Address.create(data);
};

const updateAddressById = async (id, data) => {
  return await Address.findByIdAndUpdate(id, data, { new: true });
};

const updateAllAddresses = async (data) => {
  return await Address.updateMany({}, data, { new: true });
};

const deleteAddressById = async (id) => {
  return await Address.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

export const addressService = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddressById,
  updateAllAddresses,
  deleteAddressById,
};
