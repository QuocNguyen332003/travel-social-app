import Notification from "../models/Notification.js";
import { emitEvent } from "../socket/socket.js";

const getNotifications = async () => {
  return await Notification.find({ _destroy: null })
};

const getNotificationsByStatus = async (receiverId, status, page = 1, limit = 10) => {
  let filter = { receiverId, _destroy: null };

  if (status === "unread") {
    filter.status = "unread";
  } else if (status === "read") {
    filter.status = "read";
  }

  try {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .populate({
          path: "senderId",
          select: "displayName hashtag avt",
          populate: {
            path: "avt",
            select: "url name",
          },
        })
        .populate({
          path: "receiverId",
          select: "displayName hashtag avt",
          populate: {
            path: "avt",
            select: "url name",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(filter),
    ]);

    return {
      success: true,
      data: notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      message: "Lấy danh sách thông báo thành công",
    };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  }
};


const getNotificationById = async (id) => {
  return await Notification.findOne({ _id: id, _destroy: null })
};

const createNotification = async (data) => {
  try {
    const { senderId, receiverId, relatedEntityType, message } = data;

    let findQuery = {
      senderId: senderId,
      receiverId: receiverId,
      relatedEntityType: relatedEntityType,
      _destroy: null, // Chỉ tìm thông báo chưa bị xóa mềm
    };

    switch (relatedEntityType) {
      case 'Group':
        findQuery.groupId = data.groupId;
        break;
      case 'Article':
        findQuery.articleId = data.articleId; 
        findQuery.commentId = data.commentId; 
        break;
      case 'Page':
        findQuery.pageId = data.pageId;
        break;
      case 'Reel':
        findQuery.reelId = data.reelId;
        if (data.commentId) {
            findQuery.commentId = data.commentId; 
        }
        break;
      case 'User':
        break;
      default:
        findQuery.message = message;
        break;
    }

    let existingNotification = await Notification.findOne(findQuery);
    let notificationToEmit; 

    if (existingNotification) {
      console.log('Đã tìm thấy thông báo hiện có, đang cập nhật:', existingNotification._id);

      if (existingNotification.status === 'read') {
        existingNotification.status = 'unread';
        existingNotification.readAt = null;
      }
      if (existingNotification.message !== data.message) {
          existingNotification.message = data.message;
      }
      existingNotification.createdAt = Date.now();

      await existingNotification.save();
      notificationToEmit = existingNotification;

    } else {
      const newNotification = await Notification.create(data);
      notificationToEmit = newNotification;
    }

    notificationToEmit = await Notification.findById(notificationToEmit._id)
      .populate({
        path: "senderId",
        select: "displayName hashtag avt",
        populate: {
          path: "avt",
          select: "url name",
        },
      })
      .populate({
        path: "receiverId",
        select: "displayName hashtag avt",
        populate: {
          path: "avt",
          select: "url name",
        },
      });

    if (existingNotification) {
      emitEvent("user", data.receiverId, "updatedNotification", {
        notification: notificationToEmit, // Gửi thông báo đã được populate
      });
    } else {
      emitEvent("user", data.receiverId, "newNotification", {
        notification: notificationToEmit, // Gửi thông báo đã được populate
      });
    }

    return notificationToEmit;
  } catch (error) {
    console.error("Lỗi trong createNotification:", error);
    throw error;
  }
};

const updateNotificationById = async (id, data) => {
  return await Notification.findByIdAndUpdate(id, data, { new: true })
};

const updateAllNotifications = async (data) => {
  return await Notification.updateMany({}, data, { new: true });
};

const deleteNotificationById = async (id) => {
  return await Notification.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

export const notificationService = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotificationById,
  updateAllNotifications,
  deleteNotificationById,
  getNotificationsByStatus
};
