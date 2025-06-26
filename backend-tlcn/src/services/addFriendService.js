import AddFriend from '../models/AddFriend.js';
import User from '../models/User.js'

const getAll = async () => {
    return await AddFriend.find();
};

const getById = async (id) => {
    return await AddFriend.findById(id);
};

const createAddFriend = async (data) => {
  const { senderId, receiverId } = data;

  // Tìm yêu cầu kết bạn hiện có
  const existingRequest = await AddFriend.findOne({
    senderId,
    receiverId,
    status: 'pending'
  });

  if (existingRequest) {
    throw new Error("Bạn đã gửi yêu cầu này rồi");
  }

  // Kiểm tra trường hợp bị đảo ngược
  const reversedRequest = await AddFriend.findOne({
    senderId: receiverId,
    receiverId: senderId,
    status: 'pending'
  });
  
  if (reversedRequest) {
    return updateAddFriendById(reversedRequest._id, {status: "approved"})
  }

  // Nếu không có yêu cầu nào, tạo mới
  return await AddFriend.create(data);
};



const updateAddFriendById = async (id, data) => {
    // Cập nhật trạng thái của yêu cầu kết bạn
    const updatedRequest = await AddFriend.findByIdAndUpdate(id, data, { new: true });
  
    if (!updatedRequest) {
      throw new Error("Friend request not found");
    }
  
    const { senderId, receiverId, status } = updatedRequest;
  
    // Nếu yêu cầu kết bạn được chấp nhận, cập nhật danh sách bạn bè
    if (status === "approved") {
      await Promise.all([
        User.findByIdAndUpdate(senderId, { $addToSet: { friends: receiverId } }),
        User.findByIdAndUpdate(receiverId, { $addToSet: { friends: senderId } }),
      ]);
    }
  
    return updatedRequest;
  };
  

const updateAllAddFriends = async (data) => {
    return await AddFriend.updateMany({}, data, { new: true })
}

const deleteAddFriendById = async (id) => {
    return await AddFriend.findByIdAndDelete(id)
}

const getAddFriendBySenderId = async (id) => {
    const addFriendRequests = await AddFriend.find({ senderId: id, status: "pending" });
  
    const enrichedRequests = await Promise.all(
      addFriendRequests.map(async (request) => {
        const { senderId, receiverId } = request;
  
        // Lấy danh sách bạn bè của senderId và receiverId
        const sender = await User.findById(senderId)
          .populate('avt');
        const receiver = await User.findById(receiverId)
          .populate('avt');

        const senderFriends = sender?.friends.map((f) => f.toString()) || [];
        const receiverFriends = receiver?.friends.map((f) => f.toString()) || [];
  
        // Lấy danh sách bạn chung
        const mutualFriends = senderFriends.filter((friendId) =>
          receiverFriends.includes(friendId)
        );
  
        const senderGroups = [
            ...(sender?.groups?.createGroups.map((g) => g.toString()) || []),
            ...(sender?.groups?.saveGroups.map((g) => g.toString()) || []),
          ];
    
          const receiverGroups = [
            ...(receiver?.groups?.createGroups.map((g) => g.toString()) || []),
            ...(receiver?.groups?.saveGroups.map((g) => g.toString()) || []),
          ];

        // Lấy danh sách nhóm chung
        const mutualGroups = senderGroups.filter((groupId) =>
          receiverGroups.includes(groupId)
        );
  
        return {
          addFriend: request.toObject(),
          sender: {
            _id: sender._id,
            displayName: sender.displayName,
            avt: sender.avt,
            aboutMe: sender.aboutMe
          },
          receiver: {
            _id: receiver._id,
            displayName: receiver.displayName,
            avt: receiver.avt,
            aboutMe: receiver.aboutMe
          },
          mutualFriends,
          mutualGroups,
        };
      })
    );

    return enrichedRequests;
  };
  

  const getAddFriendByReceiverId = async (id) => {
    const addFriendRequests = await AddFriend.find({ receiverId: id, status: "pending" });
  
    const enrichedRequests = await Promise.all(
      addFriendRequests.map(async (request) => {
        const { senderId, receiverId } = request;
  
        // Lấy danh sách bạn bè của senderId và receiverId
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
  
        const senderFriends = sender?.friends.map((f) => f.toString()) || [];
        const receiverFriends = receiver?.friends.map((f) => f.toString()) || [];
  
        // Lấy danh sách bạn chung
        const mutualFriends = senderFriends.filter((friendId) =>
          receiverFriends.includes(friendId)
        );
  
        const senderGroups = [
            ...(sender?.groups?.createGroups.map((g) => g.toString()) || []),
            ...(sender?.groups?.saveGroups.map((g) => g.toString()) || []),
          ];
    
          const receiverGroups = [
            ...(receiver?.groups?.createGroups.map((g) => g.toString()) || []),
            ...(receiver?.groups?.saveGroups.map((g) => g.toString()) || []),
          ];

        // Lấy danh sách nhóm chung
        const mutualGroups = senderGroups.filter((groupId) =>
          receiverGroups.includes(groupId)
        );
  
        return {
          addFriend: request.toObject(),
          sender: {
            _id: sender._id,
            displayName: sender.displayName,
            avt: sender.avt
          },
          receiver: {
            _id: receiver._id,
            displayName: receiver.displayName,
            avt: receiver.avt
          },
          mutualFriends,
          mutualGroups,
        };
      })
    );
  
    return enrichedRequests;
  };

const addFriendService = {
    getAll,
    getById,
    createAddFriend,
    updateAddFriendById,
    updateAllAddFriends,
    deleteAddFriendById,
    getAddFriendBySenderId,
    getAddFriendByReceiverId
}

export default addFriendService;