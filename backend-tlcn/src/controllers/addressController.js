import { addressService } from "../services/addressService.js";

const getAddresses = async (req, res) => {
  try {
    const addresses = await addressService.getAddresses();
    res.status(200).json({ success: true, data: addresses, message: 'Lấy danh sách địa chỉ thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getAddressById = async (req, res) => {
  try {
    const address = await addressService.getAddressById(req.params.id);
    if (!address) return res.status(404).json({ success: false, data: null, message: 'Địa chỉ không tồn tại' });
    res.status(200).json({ success: true, data: address, message: 'Lấy địa chỉ thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createAddress = async (req, res) => {
  try {
    const newAddress = await addressService.createAddress(req.body);
    res.status(201).json({ success: true, data: newAddress, message: 'Tạo địa chỉ thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAddressById = async (req, res) => {
  try {
    const updatedAddress = await addressService.updateAddressById(req.params.id, req.body);
    if (!updatedAddress) return res.status(404).json({ success: false, data: null, message: 'Địa chỉ không tồn tại' });
    res.status(200).json({ success: true, data: updatedAddress, message: 'Cập nhật địa chỉ thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllAddresses = async (req, res) => {
  try {
    const updatedAddresses = await addressService.updateAllAddresses(req.body);
    res.status(200).json({ success: true, data: updatedAddresses, message: 'Cập nhật tất cả địa chỉ thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteAddressById = async (req, res) => {
  try {
    const deletedAddress = await addressService.deleteAddressById(req.params.id);
    if (!deletedAddress) return res.status(404).json({ success: false, data: null, message: 'Địa chỉ không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa địa chỉ thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

export const addressController = {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddressById,
  updateAllAddresses,
  deleteAddressById,
};
