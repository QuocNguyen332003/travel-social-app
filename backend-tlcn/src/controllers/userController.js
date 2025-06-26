import { userService } from '../services/userService.js';
import { hobbyService } from '../services/hobbyService.js';
import User from "../models/User.js";
import Account from "../models/Account.js";
import Hobby from "../models/Hobby.js";
const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ success: true, data: users, message: 'Lấy danh sách người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};
const getUsersByDisplayName = async (req, res) => {
  try {
    const { displayName, limit = 5, skip = 0 } = req.query;

    if (!displayName) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Vui lòng cung cấp displayName',
      });
    }

    const { users, total } = await userService.getUsersByDisplayName({
      displayName,
      limit: parseInt(limit),
      skip: parseInt(skip),
    });

    res.status(200).json({
      success: true,
      data: users,
      total,
      message: 'Lấy danh sách người dùng theo displayName thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, data: null, message: 'Người dùng không tồn tại' });
    res.status(200).json({ success: true, data: user, message: 'Lấy thông tin người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: newUser, message: 'Tạo người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserById(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ success: false, data: null, message: 'Người dùng không tồn tại' });
    res.status(200).json({ success: true, data: updatedUser, message: 'Cập nhật người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllUsers = async (req, res) => {
  try {
    const updatedUsers = await userService.updateAllUsers(req.body);
    res.status(200).json({ success: true, data: updatedUsers, message: 'Cập nhật tất cả người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUserById(req.params.id);
    if (!deletedUser) return res.status(404).json({ success: false, data: null, message: 'Người dùng không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa người dùng thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};
const addHobbyByEmail = async (req, res) => {
  try {
    const { email, hobbies } = req.body;
    // Gọi hàm thêm sở thích từ service
    const { user, message } = await userService.addHobbyByEmail(email, hobbies);
    return res.status(200).json({success: true,message: message,user,});
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Lỗi hệ thống, vui lòng thử lại." });
  }
};
const getSavedGroups = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Phù hợp với MyGroupTab
    const skip = (page - 1) * limit;

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "Người dùng không tồn tại" });
    }

    const { groups, total } = await userService.getSavedGroups(userId, skip, limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: groups,
      total,
      page,
      totalPages,
      message: "Lấy danh sách nhóm đã lưu thành công",
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhóm đã lưu:", error);
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getMyGroups = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "Người dùng không tồn tại" });
    }

    const { groups, total } = await userService.getMyGroups(userId, skip, limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: groups,
      total,
      page,
      totalPages,
      message: "Lấy danh sách nhóm đã tạo thành công",
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhóm đã tạo:", error);
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getNotJoinedGroups = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Phù hợp với các API khác
    const skip = (page - 1) * limit;

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "Người dùng không tồn tại" });
    }

    const { groups, total } = await userService.getNotJoinedGroups(userId, skip, limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: groups,
      total,
      page,
      totalPages,
      message: "Lấy danh sách nhóm chưa tham gia thành công",
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhóm chưa tham gia:", error);
    res.status(500).json({ success: false, data: null, message: error.message || "Lỗi server" });
  }
};

const getArticleAllGroups = async (req, res) => {
  try {
    const userId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Kiểm tra người dùng có tồn tại hay không
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, data: null, message: "Người dùng không tồn tại" });
    }

    // Lấy danh sách bài viết đã duyệt với phân trang
    const { articles, total } = await userService.getArticleAllGroups(userId, skip, limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: articles,
      total,
      page,
      totalPages,
      message: "Lấy danh sách bài viết đã duyệt thành công",
    });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết đã duyệt:", error);
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getPhotoAvt = async (req, res) => {
  try {
    const myPhotos = await userService.getPhotoAvt(req.params.id, req.query);
    res.status(200).json({ success: true, data: myPhotos, message: 'Lấy danh sách ảnh đại diện' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createCollection = async (req, res) => {
  try {
    const result = await userService.createCollection(req.body.userId, req.body.name, req.body.type);
    res.status(200).json({ success: true, data: result, message: 'Tạo bộ sưu tập thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const result = await userService.deleteCollection(req.params.id, req.query.collectionId);
    res.status(200).json({ success: true, data: result, message: 'Xóa bộ sưu tập thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getAllCollection = async (req, res) => {
  try {
    const result = await userService.getAllCollection(req.params.id);
    res.status(200).json({ success: true, data: result, message: 'Lấy danh sách bộ sưu tập thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};


const getEarliestItems = async (req, res) => {
  try {
    const result = await userService.getEarliestItems(req.params.id, req.query.limit);
    res.status(200).json({ success: true, data: result, message: 'Lấy danh sách gần đây' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateUserSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { setting } = req.body;

    // Kiểm tra setting có tồn tại hay không
    if (!setting || typeof setting !== 'object') {
      return res.status(400).json({ success: false, message: 'Dữ liệu setting không hợp lệ' });
    }

    // Cập nhật setting của user
    const updatedUser = await userService.updateUserSetting(id, setting);

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    res.status(200).json({
      success: true,
      data: updatedUser.setting,
      message: 'Cập nhật setting thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllFriends = async (req, res) => {
  try {
    const result = await userService.getAllFriends(req.params.id);
    res.status(200).json({ success: true, data: result, message: 'Lấy danh sách bạn bè' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const unFriends = async (req, res) => {
  try {
    const { friendId } = req.body;
    const dataAddFriend = await userService.unFriends(req.params.id, friendId)
    if (!dataAddFriend) return res.status(404).json({ success: false, data: null, message: 'Không có thông tin' })
    res.status(200).json({ success: true, data: dataAddFriend, message: 'Hủy kết bạn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const suggestedFriends = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 10;
    const dataAddFriend = await userService.suggestFriends(req.params.id, skip, limit)
    if (!dataAddFriend) return res.status(404).json({ success: false, data: null, message: 'Không có thông tin' })
    res.status(200).json({ success: true, data: dataAddFriend, message: 'Lấy danh sách gợi ý thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getCreatedPages = async (req, res) => {
  try {
    const result = await userService.getCreatedPages(
      req.params.id,
      req.query.limit,
      req.query.skip
    );
    if (!result) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Người dùng không tồn tại',
      });
    }
    res.status(200).json({
      success: true,
      data: result,
      message: 'Lấy danh sách Page thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
}
export const getUserByAccountId = async (req, res) => {
  try {
    const { accountId } = req.params;
    
    const user = await userService.getUserByAccountId(accountId);
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Lỗi khi lấy user theo account ID:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server'
    });
  }
};

const addSavedLocation = async (req, res) => {
  try {
    const result = await userService.addSavedLocation(
      req.params.id,
      req.body
    );
    if (!result.success) {
      return res.status(400).json({
        success: false,
        data: null,
        message: result.message,
      });
    }
    res.status(200).json({
      success: true,
      data: result,
      message: 'Cập nhật thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
}

const deleteSavedLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { savedId } = req.query;

    if (!savedId) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Thiếu savedId",
      });
    }

    const result = await userService.deleteSavedLocation(id, savedId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        data: null,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      data: result.user,
      message: "Đã xóa địa điểm thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getAllSavedLocation = async (req, res) => {
  try {
    const { id } = req.params; // Lấy userId từ URL

    const result = await userService.getAllSavedLocation(id);

    if (!result.success){
      return res.status(400).json({
        success: false,
        data: null,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      savedLocations: result.savedLocations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      savedLocations: [],
    });
  }
};

const checkSavedLocation = async (req, res) => {
  try {
    const { id } = req.params; // Lấy userId từ URL
    const { location } = req.body;

    const result = await userService.checkSavedLocation(id, location);

    if (!result.success){
      return res.status(400).json({
        success: false,
        data: null,
        saved: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      savedLocation: result.savedLocation,
      saved: result.saved
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      saved: false,
      message: error.message
    });
  }
};

const getAllTrip = async (req, res) => {
  try {
    const { id } = req.params; // Lấy userId từ URL

    const result = await userService.getAllTrip(id);

    if (!result.success){
      return res.status(400).json({
        success: false,
        data: null,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      trips: result.trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      saved: false,
      message: error.message
    });
  }
};

const createTrip = async (req, res) => {
  try {
    const { id } = req.params; // Lấy userId từ URL
    const data = req.body;

    const result = await userService.createTrip(id, data);

    if (!result.success){
      return res.status(400).json({
        success: false,
        data: null,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      trip: result.trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      saved: false,
      message: error.message
    });
  }
};
// Lấy danh sách hobbies theo userId
const getHobbiesByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const hobbies = await userService.getHobbiesByUserId(id);

    res.status(200).json({
      success: true,
      data: hobbies,
      message: 'Lấy danh sách sở thích thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

// Cập nhật hobbies theo userId
const updateHobbiesByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const { hobbies } = req.body;

    const updatedHobbies = await userService.updateHobbiesByUserId(id, hobbies);

    res.status(200).json({
      success: true,
      data: updatedHobbies,
      message: 'Cập nhật sở thích thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};
const getGroupByGroupName = async (req, res) => {
  try {
    const { groupName, userId, limit = 5, skip = 0 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Vui lòng cung cấp userId',
      });
    }

    const { groups, total } = await userService.getGroupByGroupName({
      groupName,
      userId,
      limit: parseInt(limit),
      skip: parseInt(skip),
    });

    res.status(200).json({
      success: true,
      data: groups,
      total,
      message: 'Lấy danh sách nhóm theo groupName thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getFriendLocationArticles = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await userService.getFriendLocationArticles(id);

    if (result.success){
      res.status(200).json({
        success: true,
        data: result.data,
        message: 'Lấy thông tin thành công'
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

export const userController = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAllUsers,
  deleteUserById,
  addHobbyByEmail,
  getSavedGroups,
  getMyGroups,
  getNotJoinedGroups,
  getArticleAllGroups,
  getPhotoAvt,
  createCollection,
  deleteCollection,
  getEarliestItems,
  getAllCollection,
  updateUserSetting,
  getAllFriends,
  unFriends,
  suggestedFriends,
  getCreatedPages,
  addSavedLocation,
  deleteSavedLocation,
  getAllSavedLocation,
  checkSavedLocation,
  getAllTrip,
  createTrip,
  getUserByAccountId,
  getHobbiesByUserId,
  updateHobbiesByUserId,
  getUsersByDisplayName,
  getGroupByGroupName,
  getFriendLocationArticles
};
