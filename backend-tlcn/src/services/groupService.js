import Group from "../models/Group.js";
import User from "../models/User.js";
import Article from "../models/Article.js";
import MyPhoto from "../models/MyPhoto.js";
import { cloudStorageService } from "../config/cloudStorage.js";
import { articleService } from "../services/articleService.js";
import { myPhotoService } from "./myPhotoService.js";

const getGroups = async () => {
  return await Group.find({ _destroy: null })
};

const getGroupById = async (id) => {
  return await Group.findOne({ _id: id, _destroy: null }) 
    .populate('avt', 'url name') 
    .populate('members.idUser', '_id'); 
};


const createGroup = async ({ groupName, type, idCreater, introduction, rule, hobbies, avatarFile }) => {
  try {

    const normalizeHobbies = Array.isArray(hobbies) 
    ? hobbies 
    : hobbies.split(",").map(hobbie => hobbie.trim());

    const newGroup = await Group.create({
      groupName,
      type,
      idCreater,
      introduction,
      rule,
      hobbies: normalizeHobbies,
      members: [{
        idUser: idCreater,
        state: 'accepted', 
        joinDate: new Date(),
      }],
      article: [],
      Administrators: [],
    });


    if (avatarFile) {
      const uploadedFile = await myPhotoService.uploadAndSaveFile(avatarFile, idCreater, "img", 'groups', newGroup._id);
      newGroup.avt = uploadedFile._id
      await newGroup.save();
    }

    const user = await User.findById(idCreater);
    if (user) {
      user.groups.createGroups.push(newGroup._id); 
      await user.save();
    } else {
      throw new Error("User not found");
    }

    return newGroup;
  } catch (error) {
    console.error("Lỗi khi tạo nhóm:", error);
    throw new Error("Lỗi khi tạo nhóm");
  }
};

const updateGroupById = async (id, data) => {
  try {
    const group = await Group.findById(id).populate("avt");
    if (!group) {
      return null; // Trả về null nếu không tìm thấy nhóm
    }

    // Cập nhật các trường thông thường
    if (data.groupName) group.groupName = data.groupName;
    if (data.type) group.type = data.type;
    if (data.introduction) group.introduction = data.introduction;

    // Xử lý rule và hobbies (cần đảm bảo là chuỗi JSON nếu gửi từ client)
    if (data.rule) {
      try {
        group.rule = JSON.parse(data.rule);
      } catch (e) {
        console.error("Lỗi parse rule:", e);
        throw new Error("Quy tắc không hợp lệ: phải là chuỗi JSON");
      }
    }
    if (data.hobbies) {
      try {
        group.hobbies = JSON.parse(data.hobbies);
      } catch (e) {
        console.error("Lỗi parse hobbies:", e);
        throw new Error("Sở thích không hợp lệ: phải là chuỗi JSON");
      }
    }

    // Xử lý xóa avatar
    if (data.removeAvatar === "true") { // Chú ý: kiểm tra string 'true'
      if (group.avt) { // Chỉ xóa nếu có avatar hiện tại
        const oldFileUrl = group.avt?.url || null;
        if (oldFileUrl) {
          try {
            const cleanFileName = oldFileUrl.split("?")[0].split("/").pop();
            const filePath = `srcv2/images/groups/${id}/${cleanFileName}`;
            await cloudStorageService.deleteImageFromStorage(filePath);
          } catch (error) {
            if (error.code === 404) {
               // console.warn("Old avatar file not found in GCS:", oldFileUrl); // Bỏ log này nếu không cần
            } else {
            //   console.error("Error deleting GCS file:", error); // Bỏ log này nếu không cần
            }
          }
          await MyPhoto.findByIdAndDelete(group.avt._id);
        }
        group.avt = null; // Đặt avatar về null sau khi xóa
      }
    } 
    // Xử lý cập nhật avatar mới
    else if (data.avatarFile) { // Chỉ xử lý nếu có file avatar mới
      if (group.avt) { // Nếu đã có avatar cũ, xóa nó trước
        const oldFileUrl = group.avt?.url || null;
        if (oldFileUrl) {
          try {
            const cleanFileName = oldFileUrl.split("?")[0].split("/").pop();
            const filePath = `srcv2/images/groups/${id}/${cleanFileName}`;
            await cloudStorageService.deleteImageFromStorage(filePath);
          } catch (error) {
            if (error.code === 404) {
            //   console.warn("Old avatar file not found in GCS:", oldFileUrl); // Bỏ log này nếu không cần
            } else {
            //   console.error("Error deleting old GCS file:", error); // Bỏ log này nếu không cần
            }
          }
          await MyPhoto.findByIdAndDelete(group.avt._id);
        }
      }
      
      const uploadedFile = await myPhotoService.uploadAndSaveFile(
        data.avatarFile,
        group.idCreater, // Đảm bảo idCreater tồn tại và hợp lệ
        "img",
        "groups",
        group._id
      );
      group.avt = uploadedFile._id; // Gán ID của ảnh mới
    }
    
    // Lưu lại nhóm sau khi tất cả các thay đổi đã được thực hiện
    await group.save(); 
    
    // Populate lại avatar nếu cần thiết cho response (nếu bạn muốn trả về URL mới)
    // Hoặc bạn có thể trả về group.avt._id và để client xử lý hiển thị
    const updatedGroup = await Group.findById(id).populate("avt");
    return updatedGroup;

  } catch (error) {
    // console.error("Lỗi khi cập nhật nhóm:", error); // Bỏ log này nếu không cần
    throw new Error("Lỗi khi cập nhật nhóm");
  }
};


const updateAllGroups = async (data) => {
  return await Group.updateMany({}, data, { new: true });
};

const deleteGroupById = async (groupId) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) throw new Error("Nhóm không tồn tại");

    group._destroy = new Date();
    await group.save();

    if (group.avt) {
      await MyPhoto.findByIdAndUpdate(group.avt, { _destroy: new Date() });
    }

    await Article.updateMany({ groupID: groupId }, { _destroy: new Date() });

    await User.updateOne(
      { _id: group.idCreater },
      { $pull: { "groups.createGroups": groupId } }
    );

    await User.updateMany(
      { "groups.saveGroups": groupId },
      { $pull: { "groups.saveGroups": groupId } }
    );

    return group;
  } catch (error) {
    console.error("❌ Lỗi khi xóa nhóm:", error);
    throw new Error("Lỗi khi xóa nhóm");
  }
};

const requestJoinGroup = async (groupId, userId) => {
  try {
    const group = await Group.findOne({ _id: groupId, _destroy: null });

    if (!group) {
      return { success: false, message: "Nhóm không tồn tại" };
    }
    const existingMember = group.members.find(member => member.idUser.toString() === userId);
    if (existingMember) {
      if (existingMember.state === "accepted") {
        return { success: false, message: "Người dùng đã là thành viên của nhóm" };
      }
      if (existingMember.state === "pending") {
        return { success: false, message: "Người dùng đã gửi yêu cầu tham gia trước đó" };
      }
    }

    group.members.push({ idUser: userId, state: "pending" });
    await group.save();

    return { success: true, message: "Gửi yêu cầu tham gia nhóm thành công" };
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu tham gia nhóm:", error);
    return { success: false, message: error.message };
  }
};

const requestJoinOrLeaveGroup = async (groupId, userId) => {
  try {
    const group = await Group.findOne({ _id: groupId, _destroy: null });

    if (!group) {
      return { success: false, message: "Nhóm không tồn tại" };
    }

    const existingMemberIndex = group.members.findIndex(member => member.idUser.toString() === userId);

    if (existingMemberIndex !== -1) {
      // Nếu đã tồn tại, xóa khỏi danh sách members
      group.members.splice(existingMemberIndex, 1);
      await group.save();
      return { success: true, message: "Hủy yêu cầu tham gia nhóm thành công" };
    }

    // Nếu chưa tồn tại, thêm vào danh sách với trạng thái "pending"
    group.members.push({ idUser: userId, state: "pending", joinDate: new Date() });
    await group.save();

    return { success: true, message: "Gửi yêu cầu tham gia nhóm thành công" };
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu tham gia/hủy nhóm:", error);
    return { success: false, message: error.message };
  }
};

const getApprovedArticles = async (groupId, skip, limit) => {
  try {
    const group = await Group.findOne({ _id: groupId, _destroy: null });

    if (!group) {
      throw new Error("Nhóm không tồn tại");
    }

    // Lấy ID bài viết đã duyệt
    const approvedArticleIds = group.article
      ?.filter(article => article && article.state === "approved" && article.idArticle)
      .map(article => article.idArticle.toString()) || [];

    if (!approvedArticleIds.length) {
      return { articles: [], total: 0 };
    }

    // Áp dụng phân trang
    const paginatedArticleIds = approvedArticleIds.slice(skip, skip + limit);

    // Lấy bài viết bằng getArticleById
    const articles = await Promise.all(
      paginatedArticleIds.map(async (articleId) => {
        return await articleService.getArticleById(articleId);
      })
    );

    // Lọc bài viết hợp lệ
    const validArticles = articles.filter(article => article !== null);

    // Tổng số bài viết
    const total = approvedArticleIds.length;

    return { articles: validArticles, total };
  } catch (error) {
    console.error("Lỗi khi lấy bài viết đã duyệt:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi lấy bài viết đã duyệt");
  }
};

const getPendingArticles = async (groupId, skip, limit) => {
  try {
    const group = await Group.findOne({ _id: groupId, _destroy: null });

    if (!group) {
      throw new Error("Nhóm không tồn tại");
    }

    // Filter pending articles
    const pendingArticleIds = group.article
      ?.filter(article => article && article.state === "pending" && article.idArticle)
      .map(article => article.idArticle.toString()) || [];

    if (!pendingArticleIds.length) {
      return { articles: [], total: 0 };
    }

    // Apply pagination
    const paginatedArticleIds = pendingArticleIds.slice(skip, skip + limit);

    // Fetch articles
    const articles = await Promise.all(
      paginatedArticleIds.map(async (articleId) => {
        return await articleService.getArticleById(articleId);
      })
    );

    // Filter valid articles
    const validArticles = articles.filter(article => article !== null);

    // Total number of pending articles
    const total = pendingArticleIds.length;

    return { articles: validArticles, total };
  } catch (error) {
    console.error("Lỗi khi lấy bài viết đang chờ duyệt:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi lấy bài viết đang chờ duyệt");
  }
};

const updateArticleStatus = async (groupId, articleId, action) => {
  try {
    if (!action || !['approve', 'reject'].includes(action)) {
      return {
        success: false,
        status: 400,
        message: 'Hành động không hợp lệ. Vui lòng chọn "approve" hoặc "reject".',
      };
    }

    // Tìm nhóm theo ID
    const group = await Group.findOne({ _id: groupId, _destroy: null }).exec();
    if (!group) {
      return {
        success: false,
        status: 404,
        message: 'Nhóm không tồn tại',
      };
    }

    // Kiểm tra xem bài viết có tồn tại trong nhóm không
    const articleIndex = group.article.findIndex(
      (article) => article.idArticle.toString() === articleId
    );
    if (articleIndex === -1) {
      return {
        success: false,
        status: 404,
        message: 'Bài viết không tồn tại trong nhóm',
      };
    }

    if (action === 'approve') {
      // Cập nhật trạng thái bài viết thành approved
      group.article[articleIndex].state = 'approved';
      await group.save();
      return {
        success: true,
        message: 'Bài viết đã được duyệt thành công.',
      };
    } else if (action === 'reject') {
      // Xóa bài viết khỏi mảng article
      await Group.updateOne(
        { _id: groupId, _destroy: null },
        { $pull: { article: { idArticle: articleId } } }
      );
      return {
        success: true,
        message: 'Bài viết đã bị từ chối và xóa khỏi nhóm.',
      };
    }
  } catch (error) {
    console.error('Lỗi khi xử lý bài viết:', error);
    throw new Error('Lỗi server');
  }
};

const getRulesById = async (groupId) => {
  return await Group.findOne({ _id: groupId, _destroy: null }) 
    .select('rule')
};

const addRuleToGroup = async (groupId, rule) => {
  const group = await Group.findById(groupId);

  if (!group) {
    throw new Error('Nhóm không tồn tại');
  }
  if (group.rule.includes(rule)) {
    throw new Error('Quy tắc đã tồn tại');
  }

  group.rule.push(rule);

  return await group.save();
};


const deleteRuleFromGroup = async (groupId, ruleValue) => {
  try {
    const group = await Group.findOne({ _id: groupId, _destroy: null });
    if (!group) {
      return { success: false, message: 'Nhóm không tồn tại' };
    }

    const ruleIndex = group.rule.indexOf(ruleValue);
    if (ruleIndex === -1) {
      return { success: false, message: 'Quy tắc không tồn tại' };
    }

    group.rule.splice(ruleIndex, 1);
    await group.save();

    return { success: true, message: 'Xóa quy tắc thành công', data: group };
  } catch (error) {
    console.error('Lỗi khi xóa quy tắc:', error);
    return { success: false, message: 'Lỗi server' };
  }
};

const getPendingMembers = async (groupID, skip, limit) => {
  try {
    const group = await Group.findById(groupID)
      .populate({
        path: 'members.idUser',
        select: 'displayName avt account.email account.phone',
        populate: {
          path: 'avt',
          select: 'url',
        },
      });

    if (!group) {
      throw new Error("Nhóm không tồn tại");
    }

    // Lấy danh sách thành viên chờ duyệt
    const pendingMembers = group.members
      .filter(member => member && member.state === "pending" && member.idUser)
      .map(member => ({
        id: member.idUser?._id?.toString(),
        fullName: member.idUser?.displayName || "Unknown",
        email: member.idUser?.account?.email || "",
        phone: member.idUser?.account?.phone || "",
        avatar: member.idUser?.avt?.length > 0 ? member.idUser.avt[member.idUser.avt.length - 1]?.url : "",
        joinDate: member.joinDate,
      }));

    if (!pendingMembers.length) {
      return { pendingMembers: [], total: 0 };
    }

    // Áp dụng phân trang
    const paginatedMembers = pendingMembers.slice(skip, skip + limit);

    // Tổng số thành viên chờ duyệt
    const total = pendingMembers.length;

    return {
      pendingMembers: paginatedMembers,
      total,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thành viên chờ duyệt:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi lấy danh sách thành viên chờ duyệt");
  }
};

const getPendingAdmins = async (groupID, skip, limit) => {
  try {
    const group = await Group.findById(groupID)
      .populate({
        path: 'Administrators.idUser',
        select: 'displayName avt account.email account.phone',
        populate: {
          path: 'avt',
          select: 'url',
        },
      });

    if (!group) {
      throw new Error("Nhóm không tồn tại");
    }

    const pendingAdmins = group.Administrators
      .filter(admin => admin && admin.state === "pending" && admin.idUser)
      .map(admin => ({
        id: admin.idUser?._id?.toString(),
        fullName: admin.idUser?.displayName || "Unknown",
        avatar: admin.idUser?.avt?.length > 0 ? admin.idUser.avt[admin.idUser.avt.length - 1]?.url : "",
        inviteDate: admin.joinDate,
      }));

    if (!pendingAdmins.length) {
      return { pendingAdmins: [], total: 0 };
    }

    const total = pendingAdmins.length;

    // Áp dụng phân trang
    const paginatedAdmins = pendingAdmins.slice(skip, skip + limit);

    return {
      pendingAdmins: paginatedAdmins,
      total,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách quản trị viên chờ duyệt:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi lấy danh sách quản trị viên chờ duyệt");
  }
};


const updateMemberStatus = async (groupID, userID, state) => {
  const group = await Group.findById(groupID);
  if (!group) throw { status: 404, message: "Nhóm không tồn tại" };

  const user = await User.findById(userID);
  if (!user) throw { status: 404, message: "Người dùng không tồn tại" };

  const isMember = group.members.find((member) => member.idUser.toString() === userID);
  const isAdmin = group.Administrators.find((admin) => admin.idUser.toString() === userID);
  const isOwner = group.idCreater.toString() === userID;

  if (isOwner) throw { status: 403, message: "Không thể cập nhật người tạo nhóm" };

  if (state === "invite-admin" && isMember) {
    group.Administrators.push({ idUser: userID, state: "pending" });
  } else if (state === "accept-admin" && isAdmin) {
    const adminIndex = group.Administrators.findIndex(admin => admin.idUser.toString() === userID);
    if (adminIndex !== -1) {
      group.Administrators[adminIndex].state = "accepted";
    } else {
      console.warn(`Người dùng ${userID} được yêu cầu accept-admin nhưng không tìm thấy trong danh sách Administrators.`)
    }
  } else if (state === "remove-admin" && isAdmin) {
    console.log('loại bỏ quản trị viên')
    group.Administrators = group.Administrators.filter(admin => admin.idUser.toString() !== userID);
  } else if (state === "accepted" && isMember) {
    isMember.state = "accepted";
    if (!user.groups.saveGroups.some(groupId => groupId.toString() === groupID)) {
      user.groups.saveGroups.push(groupID);
      await user.save(); 
    }
  } else if (state === "rejected") {
    console.log('rời nhóm')
    group.members = group.members.filter((member) => member.idUser.toString() !== userID);
    user.groups.saveGroups = user.groups.saveGroups.filter(groupId => groupId.toString() !== groupID);
    await user.save(); 
  } else if (state === "admin-and-rejected") {
    group.Administrators = group.Administrators.filter(admin => admin.idUser.toString() !== userID);
    group.members = group.members.filter((member) => member.idUser.toString() !== userID);
    user.groups.saveGroups = user.groups.saveGroups.filter(groupId => groupId.toString() !== groupID);
    await user.save();
    console.log(`Admin ${userID} has left group ${groupID} and admin role has been removed.`);
  } else {
    throw { status: 400, message: "Không thể cập nhật trạng thái" };
  }

  await group.save();
  return { id: userID, state };
};

const getGroupMembers = async (groupID) => {
  const group = await Group.findById(groupID)
    .populate({
      path: "idCreater",
      select: "displayName avt aboutMe",
      populate: { path: "avt", select: "url" },
    })
    .populate({
      path: "Administrators.idUser",
      select: "displayName avt aboutMe",
      populate: { path: "avt", select: "url" },
    })
    .populate({
      path: "members.idUser",
      select: "displayName avt aboutMe",
      populate: { path: "avt", select: "url" },
    });

  if (!group) {
    throw { status: 404, message: "Nhóm không tồn tại" };
  }

  const idCreaterID = group.idCreater?._id?.toString();

  const uniqueAdmins = group.Administrators
    .filter((admin) =>
      admin.state === "accepted" &&
      admin.idUser?._id?.toString() !== idCreaterID)
    .map((admin) => ({
      id: admin.idUser?._id?.toString(),
      name: admin.idUser?.displayName || "Không có thông tin",
      avatar: admin.idUser?.avt[admin.idUser.avt.length - 1]?.url || "",
      description: admin.idUser?.aboutMe || "",
      joinDate: admin.joinDate, // Lấy joinDate từ admin object
    }));

  const uniqueMembers = group.members
    .filter((member) =>
      member.state === "accepted" &&
      member.idUser?._id?.toString() !== idCreaterID &&
      !uniqueAdmins.some((admin) => admin.id === member.idUser?._id?.toString())
    )
    .map((member) => ({
      id: member.idUser?._id?.toString(),
      name: member.idUser?.displayName || "Không có thông tin",
      avatar: member.idUser?.avt[member.idUser.avt.length - 1]?.url || "",
      description: member.idUser?.aboutMe || "",
      joinDate: member.joinDate, // Lấy joinDate từ member object
    }));

  return {
    idCreater: {
      id: idCreaterID,
      name: group.idCreater?.displayName || "Không có thông tin",
      avatar: group.idCreater?.avt[group.idCreater.avt.length - 1]?.url || "",
      description: group.idCreater?.aboutMe || "",
      joinDate: group.createdAt,
    },
    Administrators: uniqueAdmins,
    members: uniqueMembers,
  };
};

const getUserApprovedArticles = async (groupID, userID, skip, limit) => {
  try {
    const group = await Group.findById(groupID);
    if (!group) {
      throw { status: 404, message: "Nhóm không tồn tại" };
    }

    // Filter approved articles
    const approvedArticleIds = group.article
      ?.filter(a => a && a.state === "approved" && a.idArticle)
      .map(a => a.idArticle.toString()) || [];

    if (!approvedArticleIds.length) {
      return { articles: [], total: 0 };
    }

    // Query articles with pagination
    const articles = await Article.find({
      _id: { $in: approvedArticleIds },
      createdBy: userID,
      _destroy: null,
    })
      .populate({
        path: "createdBy",
        select: "_id displayName avt",
        populate: {
          path: "avt",
          select: "_id name idAuthor type url createdAt updatedAt",
        },
      })
      .populate({
        path: "listPhoto",
        select: "_id name idAuthor type url createdAt updatedAt",
        populate: {
          path: "idAuthor",
          select: "_id displayName avt",
        },
      })
      .populate({
        path: "groupID",
        select: "_id groupName",
      })
      .populate({
        path: "address",
        select: "_id province district ward street placeName lat long",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Total count of approved articles
    const total = await Article.countDocuments({
      _id: { $in: approvedArticleIds },
      createdBy: userID,
      _destroy: null,
    });

    return { articles, total };
  } catch (error) {
    console.error("Lỗi khi lấy bài viết đã duyệt:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi lấy bài viết đã duyệt");
  }
};


const checkAdminInvite = async (groupID, administratorsID) => {
  try {

    const group = await Group.findById(groupID)
      .populate({
        path: "idCreater",
        select: "displayName avt",
        populate: { path: "avt", select: "url" },
      });

    if (!group) {
      throw { status: 404, message: "Nhóm không tồn tại" };
    }

    const adminInvite = group.Administrators.find(
      (admin) => admin.idUser.toString() === administratorsID && admin.state === "pending"
    );

    return {
      hasInvite: adminInvite ? true : false,
      groupId: group._id.toString(),
      groupName: group.groupName,
      inviterName: group.idCreater?.displayName || "Không có thông tin",
      inviterId: group.idCreater || "Không có thông tin",
      inviteDate: adminInvite?.joinDate,
      inviterAvatar: group.idCreater?.avt[0]?.url || "",
    };
  } catch (error) {
    console.error("❌ Lỗi chi tiết khi kiểm tra lời mời làm quản trị viên:", error); // Log lỗi chi tiết
    throw {
      status: error.status || 500,
      message: error.message || "Lỗi máy chủ",
      details: error.stack || "Không có chi tiết lỗi", // Thêm stack trace
    };
  }
};

const getInvitableFriends = async (groupId, userId) => {
  try {
    const user = await User.findById(userId).populate("friends", "displayName avt");
    const group = await Group.findById(groupId).populate("members.idUser", "_id");

    if (!user || !group) {
      return null;
    }

    const groupMemberIds = group.members.map(member => member.idUser._id.toString());

    const invitableFriends = await Promise.all(
      user.friends
        .filter(friend => !groupMemberIds.includes(friend._id.toString()))
        .map(async friend => {
          const avatar = await MyPhoto.findById(friend.avt).select("url");
          return {
            _id: friend._id,
            displayName: friend.displayName,
            avt: avatar ? avatar.url : null,
          };
        })
    );

    return invitableFriends;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè có thể mời:", error);
    throw error;
  }
};



export const groupService = {
  getGroups,
  getGroupById,
  createGroup,
  updateGroupById,
  updateAllGroups,
  deleteGroupById,
  requestJoinGroup,
  requestJoinOrLeaveGroup,
  getApprovedArticles,
  getPendingArticles,
  updateArticleStatus,
  getRulesById,
  addRuleToGroup,
  deleteRuleFromGroup,
  getPendingMembers,
  getPendingAdmins,
  updateMemberStatus,
  getGroupMembers,
  getUserApprovedArticles,
  checkAdminInvite,
  getInvitableFriends
};
