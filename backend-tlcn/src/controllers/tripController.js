import { tripService } from "../services/tripService.js";

const getTrips = async (req, res) => {
  try {
    const trips = await tripService.getTrips();
    res.status(200).json({ success: true, data: trips, message: 'Lấy danh sách chuyến đi thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, data: null, message: 'Chuyến đi không tồn tại' });
    res.status(200).json({ success: true, data: trip, message: 'Lấy chuyến đi thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createTrip = async (req, res) => {
  try {
    const newTrip = await tripService.createTrip(req.body);
    res.status(201).json({ success: true, data: newTrip, message: 'Tạo chuyến đi thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateTripById = async (req, res) => {
  try {
    const updatedTrip = await tripService.updateTripById(req.params.id, req.body);
    if (!updatedTrip) return res.status(404).json({ success: false, data: null, message: 'Chuyến đi không tồn tại' });
    res.status(200).json({ success: true, data: updatedTrip, message: 'Cập nhật chuyến đi thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllTrips = async (req, res) => {
  try {
    const updatedTrips = await tripService.updateAllTrips(req.body);
    res.status(200).json({ success: true, data: updatedTrips, message: 'Cập nhật tất cả chuyến đi thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteTripById = async (req, res) => {
  try {
    const deletedTrip = await tripService.deleteTripById(req.params.id);
    if (!deletedTrip) return res.status(404).json({ success: false, data: null, message: 'Chuyến đi không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa chuyến đi thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const addNewLocation = async (req, res) => {
  try {
    const result = await tripService.addNewLocation(req.params.id, req.body);
    if (!result.success) return res.status(400).json({ success: false, data: null, message: result.message });
    res.status(200).json({ success: true, data: result.data, message: 'Thêm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteNewLocation = async (req, res) => {
  try {
    const result = await tripService.deleteNewLocation(req.params.id, req.query.locationId);
    if (!result.success) return res.status(400).json({ success: false, data: null, message: result.message });
    res.status(200).json({ success: true, data: null, message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const changePosition = async (req, res) => {
  try {
    const result = await tripService.changePosition(req.params.id, req.query.locationId1, req.query.locationId2);
    if (!result.success) return res.status(400).json({ success: false, data: null, message: result.message });
    res.status(200).json({ success: true, data: result.data, message: 'Đổi vị trí thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

export const tripController = {
  getTrips,
  getTripById,
  createTrip,
  updateTripById,
  updateAllTrips,
  deleteTripById,
  addNewLocation,
  deleteNewLocation,
  changePosition
};
