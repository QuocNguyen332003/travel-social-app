import { groupService } from '../services/groupService.js';
import mongoose from 'mongoose';

const getGroups = async (req, res) => {
  try {
    const groups = await groupService.getGroups();
    res.status(200).json({ success: true, data: groups, message: 'Lấy danh sách nhóm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getGroupById = async (req, res) => {
  try {
    const group = await groupService.getGroupById(req.params.id);
    if (!group) return res.status(404).json({ success: false, data: null, message: 'Nhóm không tồn tại' });
    res.status(200).json({ success: true, data: group, message: 'Lấy nhóm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createGroup = async (req, res) => {
  try {
    const { groupName, type, idCreater, introduction, rule = [], hobbies = [] } = req.body;
    const avatarFile = req.file;

    if (!groupName || !type || !idCreater) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    const parseArray = (input) => (typeof input === 'string' ? input.split(',').map(id => id.trim()) : input);

    const newGroup = await groupService.createGroup({
      groupName,
      type,
      idCreater,
      introduction,
      rule: parseArray(rule),
      hobbies: parseArray(hobbies),
      avatarFile,
    });

    return res.status(201).json({
      success: true,
      data: newGroup,
      message: "Tạo nhóm thành công"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi khi tạo nhóm"
    });
  }
};

const updateGroupById = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { groupName, type, introduction, rule, hobbies } = req.body;
    const avatarFile = req.file;

    const updatedGroup = await groupService.updateGroupById(groupId, {
      groupName,
      type,
      introduction,
      rule,
      hobbies,
      avatarFile,
    });

    if (!updatedGroup) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Nhóm không tồn tại",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedGroup,
      message: "Cập nhật nhóm thành công",
    });
  } catch (error) {
    console.error("Lỗi cập nhật nhóm:", error);
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Lỗi máy chủ",
    });
  }
};

const updateAllGroups = async (req, res) => {
  try {
    const updatedGroups = await groupService.updateAllGroups(req.body);
    res.status(200).json({ success: true, data: updatedGroups, message: 'Cập nhật tất cả nhóm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteGroupById = async (req, res) => {
  try {
    const deletedGroup = await groupService.deleteGroupById(req.params.id);
    if (!deletedGroup) return res.status(404).json({ success: false, data: null, message: 'Nhóm không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa nhóm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const requestJoinOrLeaveGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin người dùng" });
    }
    const response = await groupService.requestJoinOrLeaveGroup(groupId, userId);

    res.status(200).json({ success: true, data: null, message: response });
  } catch (error) {
    res.status(500).json({ success: false, data: null,  message: error.message });
  }
};

const getApprovedArticles = async (req, res) => {
  try {
    const groupId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Phù hợp với các API khác
    const skip = (page - 1) * limit;

    const { articles, total } = await groupService.getApprovedArticles(groupId, skip, limit);

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
    res.status(500).json({
      success: false,
      data: null,
      message: error.message || "Lỗi server",
    });
  }
};

const getPendingArticles = async (req, res) => {
  try {
    const groupId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Consistent with other APIs
    const skip = (page - 1) * limit;

    const { articles, total } = await groupService.getPendingArticles(groupId, skip, limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: articles,
      total,
      page,
      totalPages,
      message: "Lấy danh sách bài viết đang chờ duyệt thành công",
    });
  } catch (error) {
    console.error("Lỗi khi lấy bài viết đang chờ duyệt:", error);
    const statusCode = error.message === "Nhóm không tồn tại" ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      data: [],
      message: error.message || "Lỗi server",
    });
  }
};

const updateArticleStatus = async (req, res) => {
  const { id: groupId, articleId } = req.params;
  const { action } = req.body;

  try {
    // Gọi service để cập nhật trạng thái bài viết
    const result = await groupService.updateArticleStatus(groupId, articleId, action);

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result,
        message: `Bài viết đã được ${action === 'approve' ? 'duyệt' : 'hủy duyệt'} thành công.`,
      });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái bài viết:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

const getRulesById = async (req, res) => {
  try {
    const groupId = req.params.id;
    const rules = await groupService.getRulesById(groupId);
    res.status(200).json({ success: true, data: rules, message: 'Lấy danh sách quy định thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const addRuleToGroup = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const { rule } = req.body;

    if (!rule) {
      return res.status(400).json({ success: false, data: null, message: 'Quy tắc không được để trống' });
    }

    const updatedGroup = await groupService.addRuleToGroup(groupId, rule);

    if (!updatedGroup) {
      return res.status(404).json({ success: false, data: null, message: 'Nhóm không tồn tại' });
    }

    res.status(200).json({ success: true, data: null, message: 'Thêm quy tắc thành công' });
  } catch (error) {
    if (error.message === 'Quy tắc đã tồn tại') {
      return res.status(400).json({ success: false, data: null, message: 'Quy tắc đã tồn tại' });
    }

    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Lỗi máy chủ' });
  }
};


const deleteRule = async (req, res) => {
  const { id: groupId, ruleValue } = req.params;

  const result = await groupService.deleteRuleFromGroup(groupId, ruleValue);

  // Trả về kết quả từ service
  if (result.success) {
    return res.status(200).json({
      success: result.success,
      message: result.message,
      data: result.data,  // Có thể trả về dữ liệu nhóm đã cập nhật nếu cần
    });
  } else {
    return res.status(404).json({
      success: result.success,
      message: result.message,
    });
  }
};

const getPendingMembers = async (req, res) => {
  try {
    const { groupID } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Phù hợp với các API khác
    const skip = (page - 1) * limit;

    const { pendingMembers, total } = await groupService.getPendingMembers(groupID, skip, limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: pendingMembers,
      total,
      page,
      totalPages,
      message: "Lấy danh sách thành viên chờ duyệt thành công",
    });
  } catch (error) {
    const statusCode = error.message === "Nhóm không tồn tại" ? 404 : 500;
    const errorMessage = error.message === "Nhóm không tồn tại"
      ? "Nhóm không tồn tại"
      : "Lỗi khi lấy danh sách thành viên chờ duyệt";

    res.status(statusCode).json({
      success: false,
      data: [],
      message: errorMessage,
    });
  }
};

const getPendingAdmins = async (req, res) => {
  try {
    const { groupID } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const { pendingAdmins, total } = await groupService.getPendingAdmins(groupID, skip, limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: pendingAdmins,
      total,
      page,
      totalPages,
      message: "Lấy danh sách quản trị viên chờ duyệt thành công",
    });
  } catch (error) {
    const statusCode = error.message === "Nhóm không tồn tại" ? 404 : 500;
    const errorMessage = error.message === "Nhóm không tồn tại"
      ? "Nhóm không tồn tại"
      : "Lỗi khi lấy danh sách quản trị viên chờ duyệt";

    res.status(statusCode).json({
      success: false,
      data: [],
      message: errorMessage,
    });
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const { groupID } = req.params;
    const membersData = await groupService.getGroupMembers(groupID);

    return res.status(200).json({ success: true, data: membersData, message: "Lấy danh sách thành viên thành công" });
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách thành viên:", error);
    return res.status(error.status || 500).json({ success: false, data: null, message: error.message || "Lỗi máy chủ" });
  }
};

const updateMemberStatus = async (req, res) => {
  try {
    const { groupID, userID } = req.params;
    const { state } = req.body;

    if (!["accepted", "rejected", "invite-admin", "remove-admin", "accept-admin", "admin-and-rejected"].includes(state)) {
      return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    const updatedMember = await groupService.updateMemberStatus(groupID, userID, state);
    res.status(200).json({ success: true, data: updatedMember, message: "Cập nhật thành viên thành công" });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message || "Lỗi server" });
  }
};

const getUserApprovedArticles = async (req, res) => {
  try {
    const { groupID, userID } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Consistent with other APIs
    const skip = (page - 1) * limit;

    const { articles, total } = await groupService.getUserApprovedArticles(groupID, userID, skip, limit);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: articles,
      total,
      page,
      totalPages,
      message: "Lấy danh sách bài viết đã được duyệt thành công.",
    });
  } catch (error) {
    console.error("❌ Lỗi khi lấy bài viết đã duyệt:", error);
    return res.status(error.status || 500).json({
      success: false,
      data: [],
      message: error.message || "Lỗi server",
    });
  }
};

const checkAdminInvite =  async (req, res) => {
  try {
    const { groupID, administratorsID } = req.params;

    const adminInvite = await groupService.checkAdminInvite(groupID, administratorsID);

    return res.status(200).json({
      success: true,
      data: adminInvite,
      message: "Lấy dữ liệu thành công",
    });
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra lời mời làm quản trị viên:", error);
    return res.status(error.status || 500).json({ success: false, message: error.message || "Lỗi máy chủ" });
  }
}

const getInvitableFriends = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.query;

    if (!userId || !groupId) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin userId hoặc groupId" });
    }

    const invitableFriends = await groupService.getInvitableFriends(groupId, userId);

    if (!invitableFriends) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng hoặc nhóm" });
    }

    res.status(200).json({ success: true, data: invitableFriends, message: "Lấy dự liêu jthafnh công" });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè có thể mời:", error);
    res.status(500).json({ success: false, data: null,  message: "Lỗi khi lấy danh sách bạn bè có thể mời" });
  }
};


export const groupController = {
  getGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  updateAllGroups,
  deleteGroupById,
  requestJoinOrLeaveGroup,
  getApprovedArticles,
  getPendingArticles,
  updateArticleStatus,
  getRulesById,
  addRuleToGroup,
  deleteRule,
  getPendingMembers,
  getPendingAdmins,
  updateMemberStatus,
  getGroupMembers,
  getUserApprovedArticles,
  checkAdminInvite,
  getInvitableFriends
};
