import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js'
import MyPhoto from '../models/MyPhoto.js'
import mongoose from 'mongoose';
import { cloudStorageService } from "../config/cloudStorage.js";

const getAll = async () => {
    return await Conversation.find();
};

const getById = async (id) => {
    const conversation = await Conversation.findById(id)
      .populate({
        path: "participants",
        select: "_id displayName avt",
        populate: {
          path: "avt",
          model: "MyPhoto",
        },
      })
      .populate({
        path: "lastMessage",
        select: "_id sender content seenBy createdAt"
      })
      .populate({
        path: "avtGroup"
      })
      .populate({
        path: "pageId",
        select: "_id name avt",
        populate: {
          path: "avt",
          model: "MyPhoto",
        },
      })
      .lean(); 
    return conversation;
};

const getByUserAndFriendId = async (userId, friendId) => {
  const conversation = await Conversation.findOne({
    type: "private",
    participants: { $all: [userId, friendId], $size: 2 }
  })
    .populate({
      path: "participants",
      select: "_id displayName avt",
      populate: {
        path: "avt",
        model: "MyPhoto",
      },
    })
    .populate({
      path: "lastMessage",
      select: "_id sender content seenBy createdAt"
    })
    .populate({
      path: "avtGroup"
    })
    .populate({
      path: "pageId",
      select: "_id name avt",
      populate: {
        path: "avt",
        model: "MyPhoto",
      },
    })
    .lean();

  return conversation;
};

const createConversation = async (data) => {
    if (!data.lastMessage) return {success: false, message: "Phải có tin nhắn đầu tiên"};
    if (data.type === 'page'){
      const existingConversation = await Conversation.findOne({
        type: 'page',
        pageId: data.pageId,
        participants: data.participants
      })
      if (existingConversation) {
        return { success: true, data: existingConversation, message: "Cuộc trò chuyện đã tồn tại. Lấy dữ liệu thành công" };
      }
    }

    // Kiểm tra nếu là cuộc trò chuyện riêng tư (private)
    if (data.participants.length === 2) {
      const existingConversation = await Conversation.findOne({
          type: "private",
          participants: { $all: data.participants, $size: 2 }
      });

      if (existingConversation) {
          return { success: false, message: "Cuộc trò chuyện giữa hai người dùng đã tồn tại" };
      }
    }
    const conversation = await Conversation.create({
      creatorId: data.creatorId,
      participants: data.participants,
      groupName: data.groupName,
      avtGroup: data.avtGroup,
      pageId: data.pageId
    })

    if (!conversation) return {success: false, message: "Không thể tạo hộp thoại"};
    
    const message = await Message.create({
      conversationId: conversation._id,
      sender: data.lastMessage.sender,
      content: {
        contentType: data.lastMessage.contentType,
        message: data.lastMessage.message,
        mediaUrl: data.lastMessage.mediaUrl
      },
      seenBy: [data.creatorId]
    })
    
    if (!message) return {success: false, message: "Không thể tạo tin nhắn"};

    const updateConversation = await Conversation.findByIdAndUpdate(message.conversationId, {
      lastMessage: message._id,
      updatedAt: Date.now()
    }, { new: true })

    if (!updateConversation) return {success: false, message: "Không thể thêm tin nhắn"};
    
    return {success: true, data: updateConversation, message: "Thành công tạo hộp thoại"};
}

const updateConversationById = async (id, data) => {
    return await Conversation.findByIdAndUpdate(id, data, { new: true })
}

const updateAllConversations = async (data) => {
    return await Conversation.updateMany({}, data, { new: true })
}

const deleteConversationById = async (id) => {
    return await Conversation.findByIdAndDelete(id)
}

const getConversationOfUser = async (userId) => {
  try {
    const user = await User.findById(userId).select("friends").lean();
    if (!user) return { success: false, message: 'Không tìm thấy người dùng' };

    const conversations = await Conversation.find({
      participants: userId,
      settings: {
        $elemMatch: {
          userId: userId,
          active: true // Chỉ lấy những cuộc trò chuyện user còn hoạt động
        }
      }
    })
      .populate({
        path: "participants",
        select: "_id displayName avt",
        populate: {
          path: "avt",
          model: "MyPhoto",
        },
      })
      .populate({
        path: "lastMessage",
        select: "_id sender content seenBy createdAt"
      })
      .populate({
        path: "avtGroup"
      })
      .populate({
        path: "pageId",
        select: "_id name avt",
        populate: {
          path: "avt",
          model: "MyPhoto",
        },
      })
      .lean();

    return { user, conversations };
  } catch (error) {
    console.error("Lỗi khi lấy cuộc trò chuyện:", error);
    return { success: false, conversations: [] };
  }
};


const getConversationOfPages = async (userId) => {
  try {
    const user = await User.findById(userId).select("pages").lean();
    if (!user) return { success: false, message: 'Không tìm thấy người dùng' };

    const pagesOfUser = user.pages?.createPages || [];

    // Tìm các hội thoại mà người dùng sở hữu page
    const conversations = await Conversation.find({
      type: "page",
      pageId: { $in: pagesOfUser },
    })
      .populate({
        path: "participants",
        select: "_id displayName avt",
        populate: {
          path: "avt",
          model: "MyPhoto",
        },
      })
      .populate({
        path: "lastMessage",
        select: "_id sender content seenBy createdAt",
      })
      .populate({
        path: "pageId",
        select: "_id name avt",
        populate: {
          path: "avt",
          model: "MyPhoto",
        },
      })
      .lean();

    return { success: true, data: conversations };
  } catch (error) {
    console.error("Lỗi khi lấy hội thoại của các page:", error);
    return { success: false, message: 'Lỗi server', data: [] };
  }
};


const getConversationsFiltered = async (userId, filterByFriends) => {
  try {
    const { user, conversations } = await getConversationOfUser(userId);
    const filteredConversations = conversations
      .filter((conversation) => {
        if (conversation.type === "private") {
          // Lấy participant còn lại
          const otherParticipant = conversation.participants.find(
            (p) => p._id.toString() !== userId.toString()
          );
          // Nếu không có participant còn lại, bỏ qua hội thoại
          if (!otherParticipant) return false;

          // Kiểm tra xem participant còn lại có trong danh sách bạn bè không
          const isFriend = user.friends.some(
            (friendId) => friendId.toString() === otherParticipant._id.toString()
          );

          return filterByFriends ? isFriend : !isFriend;
        }
        return filterByFriends;
      })
      .sort(
        (a, b) =>
          new Date(b.lastMessage?.createdAt || 0).getTime() -
          new Date(a.lastMessage?.createdAt || 0).getTime()
      ); // Sắp xếp giảm dần theo thời gian
    
    return { success: true, data: filteredConversations };
      
  } catch (error) {
    return { success: false, message: "Có lỗi xảy ra trong quá trình lấy dữ liệu" };
  }
};

const getConversationFriends = async (userId) => {
  return await getConversationsFiltered(userId, true);
};

const getConversationWithoutFriends = async (userId) => {
  return await getConversationsFiltered(userId, false);
};

const getFriendsWithoutPrivateChat = async (userId) => {
  try {

    const user = await User.findById(userId).select("friends").lean();
    if (!user || !user.friends || user.friends.length === 0) {
      return { success: true, friendsWithoutPrivateChat: [] };
    }

    const privateChats = await Conversation.find({
      type: "private",
      participants: userId,
    })
      .select("participants")
      .lean();

    const usersWithPrivateChat = new Set();
    privateChats.forEach((chat) => {
      chat.participants.forEach((participant) => {
        if (participant.toString() !== userId) {
          usersWithPrivateChat.add(participant.toString());
        }
      });
    });

    const friendsWithoutPrivateChat = user.friends.filter(
      (friendId) => !usersWithPrivateChat.has(friendId.toString())
    );

    const result = await Promise.all(
      friendsWithoutPrivateChat.map(async (item) => {
        const friend = await User.findById(item).populate('avt')
        return {
          _id: friend._id,
          displayName: friend.displayName,
          avt: friend.avt
        }
      })
    )
    return { success: true, data: result };
  } catch (error) {
    return { success: false, message: "Lỗi server" };
  }
};


const updateUserSetting = async (conversationId, newSetting) => {
  try {
      const updatedConversation = await Conversation.findOneAndUpdate(
          { 
              _id: conversationId, 
              "settings.userId": newSetting.userId // Tìm phần tử có userId trùng khớp
          },
          { 
              $set: { 
                  "settings.$.notifications": newSetting.notifications, 
                  "settings.$.muteUntil": newSetting.muteUntil,
                  "settings.$.active": newSetting.active 
              }
          },
          { new: true } // Trả về bản ghi sau khi cập nhật
      );

      return {success: true, data: updatedConversation};
  } catch (error) {
    return {success: false, data: null, message: error};
  }
};

const updateSos = async (conversationsId, userId) => {
  try {
    // Cập nhật các conversation có _id thuộc conversationsId, set sos = true
    const updateTrue = await Conversation.updateMany(
      { _id: { $in: conversationsId } },
      { $set: { "settings.$[elem].sos": true } },
      { arrayFilters: [{ "elem.userId": userId }] }
    );

    const updateFalse = await Conversation.updateMany(
      { _id: { $nin: conversationsId } },
      { $set: { "settings.$[elem].sos": false } },
      { arrayFilters: [{ "elem.userId": userId }] }
    );

    return {
      success: true,
      data: { modifiedTrue: updateTrue.modifiedCount, modifiedFalse: updateFalse.modifiedCount },
      message: "Cập nhật thành công danh sách SOS"
    };
  } catch (error) {
    return { success: false, data: null, message: error.message };
  }
};

const getSosConversations = async (userId) => {
  try {
    const conversations = await Conversation.find({
      "settings": {
        $elemMatch: {
          userId: userId,
          sos: true,
          active: true
        }
      }
    })
    .populate("participants", "_id displayName avt");

    return {
      success: true,
      data: conversations,
      message: "Lấy danh sách SOS thành công"
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message
    };
  }
};

const updateParticipantsAndSettings = async (conversationId, userIds) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new Error("Cuộc trò chuyện không tồn tại");

  const existingParticipantIds = conversation.participants.map((id) => id.toString());
  const existingSettingsMap = new Map(
    conversation.settings.map((s) => [s.userId.toString(), s])
  );
  for (const userId of userIds) {
    const idStr = userId.toString();

    if (existingParticipantIds.includes(idStr)) {
      // Nếu đã tồn tại trong participants → cập nhật settings.active = true
      const setting = existingSettingsMap.get(idStr);
      if (setting) setting.active = true;
    } else {
      // Nếu chưa có → thêm vào participants và settings
      conversation.participants.push(new mongoose.Types.ObjectId(userId));
      conversation.settings.push({
        userId: new mongoose.Types.ObjectId(userId),
        notifications: true,
        muteUntil: null,
        active: true,
        sos: false,
      });
    }
  }

  // Cập nhật updatedAt
  conversation.updatedAt = Date.now();

  await conversation.save();
  return {success: true, data: conversation};
};

const changeAvtGroup = async (conversationId, userId, file) => {
  let newFile;
  if (!file || !file.buffer) {
      return {success: false, message: "Không có file hợp lệ để upload!"};
  }
  newFile = await MyPhoto.create({
      name: file.originalname,
      idAuthor: userId,
      type: 'img',
      url: "",
  });
  const destination = `srcv2/images/conversations/${conversationId}/${newFile._id}/${Date.now()}`;
  const fileUrl = await cloudStorageService.uploadImageBufferToStorage(
    file.buffer,
    destination,
    file.mimetype
  );
  if (!fileUrl) {
    return {success: false, message: "Không lấy được URL sau khi upload!"};
  }
  newFile.url = fileUrl;
  await newFile.save();

  const newConver = await Conversation.findByIdAndUpdate(conversationId, {avtGroup: newFile._id}, { new: true });

  return {success: true, data: {
    ...newConver,
    avtGroup: newFile
  }}
};

const conversationService = {
    getAll,
    getById,
    createConversation,
    updateConversationById,
    updateAllConversations,
    deleteConversationById,
    getConversationFriends,
    getFriendsWithoutPrivateChat,
    getConversationWithoutFriends,
    updateUserSetting,
    updateSos,
    getSosConversations,
    updateParticipantsAndSettings,
    getConversationOfPages,
    changeAvtGroup,
    getByUserAndFriendId
}

export default conversationService;