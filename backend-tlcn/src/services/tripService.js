import Trip from '../models/Trip.js';
import Location from '../models/Location.js';

const getTrips = async () => {
    return await Trip.find({ deleteAt: null })
  };

const getTripById = async (id) => {
  return await Trip.findOne({ _id: id, deleteAt: null })
    .populate('startAddress')
    .populate('listAddress')
    .populate('endAddress');
};  

const createTrip = async (data) => {
  const start = await Location.findOneAndUpdate(
    { latitude: data.startAddress.latitude, longitude: data.startAddress.longitude }, // Tìm theo lat & long
    { $setOnInsert: data.startAddress },
    { new: true, upsert: true }
  );
  
  const end = await Location.findOneAndUpdate(
    { latitude: data.endAddress.latitude, longitude: data.endAddress.longitude }, // Tìm theo lat & long
    { $setOnInsert: data.endAddress },
    { new: true, upsert: true }
  );  

  if (!start || !end) return null;
  const trip = await Trip.create({
    name: data.name,
    startAddress: start._id,
    endAddress: end._id
  });

  return {
    ...trip.toObject(),
    startAddress: start,
    endAddress: end
  };
};

const updateTripById = async (id, data) => {
  // Cập nhật từng Location nếu có
  if (data.startAddress && typeof data.startAddress === 'object' && data.startAddress._id) {
    await Location.findByIdAndUpdate(data.startAddress._id, data.startAddress);
  }

  if (data.endAddress && typeof data.endAddress === 'object' && data.endAddress._id) {
    await Location.findByIdAndUpdate(data.endAddress._id, data.endAddress);
  }

  if (Array.isArray(data.listAddress)) {
    // Lọc ra các địa điểm có object _id
    const updatedList = await Promise.all(
      data.listAddress.map(async (addr) => {
        if (addr && typeof addr === 'object' && addr._id) {
          await Location.findByIdAndUpdate(addr._id, addr);
        }
      })
    );
  }

  const updateTrip = await Trip.findByIdAndUpdate(id, {name: data.name}, { new: true });
  return updateTrip;
};


const updateAllTrips = async (data) => {
  return await Trip.updateMany({}, data, { new: true });
};

const deleteTripById = async (id) => {
  return await Trip.findByIdAndUpdate(id, { deleteAt: Date.now() }, { new: true });
};

const addNewLocation = async (id, newLocation) => {
  const existingLocation = await Location.findOneAndUpdate(
    { latitude: newLocation.latitude, longitude: newLocation.longitude },  // Điều kiện kiểm tra tồn tại
    { $setOnInsert: newLocation },     // Chỉ thêm nếu chưa tồn tại
    { new: true, upsert: true }        // Trả về bản ghi mới hoặc cập nhật
  );
  
  if (!existingLocation) return {success: false, message: "Không thể tạo địa điểm mới"};
  
  const updateTrip = await Trip.findByIdAndUpdate(
    id,
    { $push: { listAddress: existingLocation._id } },
    { new: true }
  );
  const result = await Trip.findById(updateTrip._id)
    .populate('startAddress')
    .populate('endAddress')
    .populate('listAddress')

  if (result) return {success: true, data: result, message: ""}
  return {success: false, message: "Không thể thêm địa điểm mới"}
};

const deleteNewLocation = async (id, locationId) => {
  const updateTrip = await Trip.findByIdAndUpdate(
    id,
    { $pull: { listAddress: locationId } },
    { new: true }
  );

  if (!updateTrip) {
    return { success: false, message: "Không thể Xóa địa điểm" };
  }

  return { success: true, message: "Đã xóa địa điểm", data: updateTrip };
};

const changePosition = async (id, locationId1, locationId2) => {
  try {
    // Tìm chuyến đi theo ID
    const trip = await Trip.findById(id);
    if (!trip) return { success: false, message: "Chuyến đi không tồn tại" };

    const list = trip.listAddress;
    
    // Tìm vị trí của locationId1 và locationId2
    const index1 = list.indexOf(locationId1);
    const index2 = list.indexOf(locationId2);

    // Kiểm tra nếu cả hai ID đều tồn tại trong danh sách
    if (index1 === -1 || index2 === -1) {
      return { success: false, message: "Một trong hai địa điểm không tồn tại trong danh sách" };
    }

    // Hoán đổi vị trí
    [list[index1], list[index2]] = [list[index2], list[index1]];

    // Cập nhật lại danh sách trong database
    await Trip.findByIdAndUpdate(id, { listAddress: list });

    return { success: true, message: "Đổi vị trí thành công" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


export const tripService = {
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
