import User from "../models/User.js";
import Group from "../models/Group.js";
import Account from "../models/Account.js";
import Hobby from "../models/Hobby.js";
import AddFriend from '../models/AddFriend.js';
import { groupService } from "./groupService.js";
import { articleService } from "./articleService.js";
import collectionService from "./collectionService.js"
import Article from "../models/Article.js";
import Location from "../models/Location.js";
import { tripService } from "./tripService.js";
import { cosineSimilarity, createUserHobbyVectors } from "../utils/userUtils.js";

const getUsers = async () => {
  // Lấy tất cả người dùng và populate trường 'friends' và 'avt'
  const users = await User.find()
    .populate({
      path: 'friends', // Populate danh sách bạn bè
      select: '_id displayName avt aboutMe' // Chỉ lấy các trường cần thiết
    })
    .populate('avt'); // Populate trường avatar nếu cần

  // Trả về danh sách người dùng đã được populate
  return users.map(user => ({
    _id: user._id,
    displayName: user.displayName,
    avt: user.avt,
    aboutMe: user.aboutMe,
  }));
};
// Hàm chuẩn hóa chuỗi
const removeVietnameseTones = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

const getUsersByDisplayName = async ({ limit = 5, skip = 0, displayName } = {}) => {
  try {
    // Chuẩn hóa chuỗi tìm kiếm
    const normalizedSearch = displayName ? removeVietnameseTones(displayName).toLowerCase() : '';

    // Lấy tất cả người dùng bằng hàm getUsers
    let allUsers = await getUsers();

    // Lọc người dùng dựa trên displayName chuẩn hóa
    if (normalizedSearch) {
      allUsers = allUsers.filter(user => {
        const normalizedDisplayName = removeVietnameseTones(user.displayName).toLowerCase();
        // So sánh gần đúng sử dụng regex
        return normalizedDisplayName.match(new RegExp(`\\b${normalizedSearch}\\w*`, 'i'));
      });
    }

    // Sắp xếp danh sách người dùng theo displayName
    allUsers.sort((a, b) => a.displayName.localeCompare(b.displayName));

    // Tính tổng số bản ghi
    const total = allUsers.length;

    // Áp dụng phân trang
    const paginatedUsers = allUsers
      .slice(skip, skip + limit)
      .map(user => ({
        _id: user._id,
        displayName: user.displayName, // Trả về displayName gốc
        avt: user.avt,
        aboutMe: user.aboutMe,
        friends: user.friends, // Trường friends đã được populate từ getUsers
      }));

    return {
      users: paginatedUsers,
      total,
    };
  } catch (error) {
    throw new Error('Không thể lấy danh sách người dùng: ' + error.message);
  }
};
const getUserById = async (id) => {
  return await User.findOne({ _id: id })
};

const createUser = async (data) => {
  return await User.create(data);
};

const updateUserById = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true })
};

const updateAllUsers = async (data) => {
  return await User.updateMany({}, data, { new: true });
};

const deleteUserById = async (id) => {
  return await User.findByIdAndUpdate(id, { deleteAt: Date.now() }, { new: true });
};


const getSavedGroups = async (userId, skip, limit) => { 
  try {
    const user = await User.findById(userId);
    if (!user || !user.groups?.saveGroups) {
      return { groups: [], total: 0 };
    }

    const allSavedGroupEntries = user.groups.saveGroups;

    const allSavedGroupIds = allSavedGroupEntries.map(groupEntry => groupEntry._id);

    const total = allSavedGroupIds.length;

    const paginatedGroupIds = allSavedGroupIds.slice(skip, skip + limit);
    const paginatedGroups = await Promise.all(paginatedGroupIds.map(groupService.getGroupById));
    const filteredGroups = paginatedGroups.filter((group) => group !== null);

    return { groups: filteredGroups, total: total };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhóm đã lưu tại service:", error);
    throw new Error("Lỗi khi lấy danh sách nhóm đã lưu.");
  }
};


const getMyGroups = async (userId, skip, limit) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.groups?.createGroups) {
      return { groups: [], total: 0 };
    }

    const savedGroupIds = user.groups.createGroups.map((group) => group._id);

    if (!savedGroupIds.length) {
      return { groups: [], total: 0 };
    }

    // Apply pagination to group IDs
    const paginatedGroupIds = savedGroupIds.slice(skip, skip + limit);

    // Fetch groups using getGroupById
    const groups = await Promise.all(
      paginatedGroupIds.map(groupId => groupService.getGroupById(groupId))
    );

    // Filter out null groups
    const validGroups = groups.filter((group) => group !== null);

    // Total count of groups
    const total = savedGroupIds.length;

    return { groups: validGroups, total };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhóm đã tạo:", error);
    throw new Error(error.message);
  }
};

const getNotJoinedGroups = async (userId, skip, limit) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { groups: [], total: 0 };
    }

    // Lấy danh sách ID nhóm đã tham gia hoặc tạo
    const joinedGroupIds = new Set([
      ...(user.groups?.createGroups?.map((group) => group._id?.toString()) || []),
      ...(user.groups?.saveGroups?.map((group) => group._id?.toString()) || []),
    ]);

    // Lấy tất cả nhóm
    const allGroups = await groupService.getGroups();

    // Lọc ID nhóm chưa tham gia
    const notJoinedGroupIds = allGroups
      .filter(group => group._id && !joinedGroupIds.has(group._id.toString()))
      .map(group => group._id.toString());

    if (!notJoinedGroupIds.length) {
      return { groups: [], total: 0 };
    }

    // Áp dụng phân trang
    const paginatedGroupIds = notJoinedGroupIds.slice(skip, skip + limit);

    // Lấy nhóm bằng getGroupById
    const groups = await Promise.all(
      paginatedGroupIds.map(groupId => groupService.getGroupById(groupId))
    );

    // Lọc nhóm hợp lệ
    const validGroups = groups.filter(group => group !== null);

    // Tổng số nhóm chưa tham gia
    const total = notJoinedGroupIds.length;

    return { groups: validGroups, total };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhóm chưa tham gia:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi lấy danh sách nhóm chưa tham gia");
  }
};

const getArticleAllGroups = async (userId, skip, limit) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    const savedGroupIds = user.groups?.saveGroups?.map(group => group._id) || [];
    const myGroupIds = user.groups?.createGroups?.map(group => group._id) || [];
    const groupIds = [...savedGroupIds, ...myGroupIds];

    if (!groupIds.length) {
      return { articles: [], total: 0 };
    }

    const groups = await Group.find({ _id: { $in: groupIds }, _destroy: null });

    const approvedArticleIds = groups.flatMap(group =>
      group.article
        ?.filter(article => article.state === "approved")
        .map(article => article.idArticle._id) || []
    );

    if (!approvedArticleIds.length) {
      return { articles: [], total: 0 };
    }

    // Apply pagination to approvedArticleIds
    const paginatedArticleIds = approvedArticleIds.slice(skip, skip + limit);

    // Fetch articles using getArticleById
    const articles = await Promise.all(
      paginatedArticleIds.map(articleId => articleService.getArticleById(articleId))
    );

    // Filter out null articles (in case getArticleById returns null)
    const validArticles = articles.filter(article => article !== null);

    // Get total count of approved articles
    const total = approvedArticleIds.length;

    return { articles: validArticles, total };
  } catch (error) {
    console.error("Lỗi khi lấy bài viết đã duyệt:", error);
    throw new Error(error.message);
  }
};

const getPhotoAvt = async (userId, query) => {
  const filter = { _destroy: null, idAuthor: userId };
  if (query.type) {
    filter.type = query.type;
  }

  const user = await User.findById(userId)
  .select('displayName _id avt')
  .populate({
    path: 'avt',
    model: 'MyPhoto',
  });

  return user.avt.map((item) => ({
    ...item.toObject(),
    idAuthor: {
      _id: user._id,
      displayName: user.displayName
    },
  }));
  
};

const createCollection = async (userId, name, type) => {
  const newCollection = await collectionService.createCollection({
      name: name,
      item: [],
      type: type
  })

  if (!newCollection) {
    throw new Error("Không thể tạo collection");
  }

  await User.findByIdAndUpdate(
    userId,
    { $push: { collections: newCollection._id } }, 
    { new: true } 
  );

  return newCollection;
};

const deleteCollection = async (userId, collectionId) => {
  const deletedCollection = await collectionService.deleteCollectionById(collectionId);

  if (!deletedCollection) {
    throw new Error("Không thể xóa collection");
  }

  await User.findByIdAndUpdate(
    userId,
    { $pull: { collections: collectionId } },
    { new: true }
  );

  return null;
};

const getAllCollection = async (userId) => {
  const user = await User.findById(userId)
      .populate({
        path: 'collections'
      })
      .lean();
  const defaultImage =
  "https://storage.googleapis.com/kltn-hcmute/public/default/default_article.png";

  return await Promise.all(
    user.collections.map(async (collection) => {
      const allPhotoIds = collection.items.map((item) => item._id)
      const articles = await Article.find({ _id: { $in: allPhotoIds } })
        .populate("listPhoto")
        .lean();

      let representImg = defaultImage;
      articles.some((article) => {
        if (article?.listPhoto?.length > 0) {
          const firstImg = article.listPhoto.find((photo) => photo.type === "img");
          if (firstImg) {
            representImg = firstImg.url;
            return true; 
          }
        }
        return false;
      });        
      
      return {
        collection: collection,
        imgDefault: representImg
      }
    })
  )
};

const getEarliestItems = async (userId, limit) => {
  const user = await User.findById(userId)
      .populate({
        path: 'collections',
        populate: {
          path: 'items._id', // Nếu items là ObjectId tham chiếu tới một collection khác, bạn cần điều chỉnh ở đây
        },
      })
      .lean();

    if (!user || !user.collections) {
      return [];
    }

    const collectionsArticle = user.collections.filter((item) => item.type === "article")
    let allItems = collectionsArticle.flatMap((collection) =>
      collection.items.map((item) => ({
        ...item,
        collectionId: collection._id, // Gắn collectionId vào từng item
      }))
    );
    allItems = allItems.sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime());
    const itemRecent = allItems.slice(0, limit);
    
    if (itemRecent.length > 0) {
      return Promise.all(
        itemRecent.map(async (item) => {
          const article = await Article.findById(item._id);
          const article_expand = await Article.findById(item._id).populate("listPhoto");
          const author = await User.findById(article.createdBy);
    
          let representImg = "https://storage.googleapis.com/kltn-hcmute/public/default/default_article.png";
    
          if (article_expand?.listPhoto?.length > 0) {
            const firstImg = article_expand.listPhoto.find((photo) => photo.type === "img");
            if (firstImg) {
              representImg = firstImg.url;
            }
          }
    
          return {
            article: article,
            updateDate: item.updateDate,
            representImg: representImg,
            author: {
              _id: author._id,
              displayName: author.displayName
            },
            collectionId: item.collectionId
          };
        })
      );
    }
    
    return [];
};
const updateUserSetting = async (id, settingData) => {
  try {
    return await User.findByIdAndUpdate(
      id,
      { $set: { setting: settingData } },
      { new: true, runValidators: true, projection: { setting: 1 } } // Chỉ trả về trường setting
    );
  } catch (error) {
    throw new Error('Lỗi khi cập nhật setting của người dùng');
  }
};

const getAllFriends = async (id) => {
  const user = await  User.findById(id);

  const allFriends = await Promise.all(
    user.friends.map(async (friend) => {
      const FriendData = await User.findById(friend)
        .populate('avt')
      return {
        _id: FriendData._id,
        displayName: FriendData.displayName,
        avt: FriendData.avt,
        aboutMe: FriendData.aboutMe
      }
    })
  );

  return allFriends;
};

const unFriends = async (id, friendId) => {
  await Promise.all([
    User.findByIdAndUpdate(id, { $pull: { friends: friendId } }),
    User.findByIdAndUpdate(friendId, { $pull: { friends: id } }),
  ]);

  return { message: "Unfriended successfully" };
};


const suggestFriendsByHobby = async (targetUserId) => {
  const { userVectors } = await createUserHobbyVectors();
  const targetVector = userVectors.get(targetUserId);
  
  const similarities = [];
  for (const [userId, vector] of userVectors.entries()) {
    if (userId === targetUserId) {
      continue;
    }

    const similarity = cosineSimilarity(targetVector, vector);
    if (similarity >= 0) {
        similarities.push({ userId, similarity });
    }
  }
  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities;
}

const suggestFriends = async (id, skip, limit) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  const userFriendsSet = new Set(user.friends.map((f) => f.toString()));
  userFriendsSet.add(id); // loại bỏ chính user

  const friendCounts = {};

  await Promise.all(
    user.friends.map(async (friendId) => {
      const friend = await User.findById(friendId);
      if (friend) {
        friend.friends.forEach((friendOfFriendId) => {
          const friendOfFriendStr = friendOfFriendId.toString();
          if (!userFriendsSet.has(friendOfFriendStr)) {
            friendCounts[friendOfFriendStr] = (friendCounts[friendOfFriendStr] || 0) + 1;
          }
        });
      }
    })
  );

  // Truy vấn danh sách người đã gửi lời mời PENDING
  const pendingSentRequests = await AddFriend.find({
    senderId: id,
    status: 'pending'
  }).select('receiverId');

  const pendingReceiverIds = new Set(pendingSentRequests.map(r => r.receiverId.toString()));

  // Lọc danh sách gợi ý
  const suggestedFriends = Object.entries(friendCounts)
    .map(([friendId, count]) => ({ friendId, count }))
    .filter(({ friendId }) => !pendingReceiverIds.has(friendId))
    .sort((a, b) => b.count - a.count);

  const similarities = await suggestFriendsByHobby(id);

  const suggestedFriendIds = new Set(suggestedFriends.map(({ friendId }) => friendId));
  const filteredSimilarities = similarities.filter(
    ({ userId }) => !suggestedFriendIds.has(userId)
  );

  const resultSameFriend = await Promise.all(
    suggestedFriends.map(async (item) => {
      const friend = await User.findById(item.friendId)
        .populate('avt');
      if (friend) {
        return {
          friend: {
            _id: friend._id,
            displayName: friend.displayName,
            avt: friend.avt,
            aboutMe: friend.aboutMe
          },
          count: item.count,
          source: 'mutualFriend'
        };
      }
    })
  );

  const filteredSimilarities_new = filteredSimilarities.filter((item) => !pendingReceiverIds.has(item.userId) && !userFriendsSet.has(item.userId));

  const resultWithHobby = await Promise.all(
    filteredSimilarities_new.map(async (item) => {
      const friend = await User.findById(item.userId)
        .populate('avt');
      if (friend) {
        return {
          friend: {
            _id: friend._id,
            displayName: friend.displayName,
            avt: friend.avt,
            aboutMe: friend.aboutMe
          },
          count: 0,
          source: 'mutualFriend'
        };
      }
    })
  );

  const result = [...resultSameFriend, ...resultWithHobby].filter(Boolean);
  const paginatedResult = result.slice(skip, skip + limit);
  return paginatedResult;
};

const addHobbyByEmail = async (email, hobbies) => {
  // Kiểm tra đầu vào
  if (!email || !hobbies || !Array.isArray(hobbies) || hobbies.length === 0) {
    throw new Error('Email và mảng hobbies là bắt buộc, hobbies phải là mảng không rỗng');
  }

  // Tìm tài khoản qua email
  const account = await Account.findOne({ email });

  if (!account) {
    throw new Error('Không tìm thấy tài khoản với email này');
  }

  // Tìm user dựa trên account
  const user = await User.findOne({ account: account._id });

  if (!user) {
    throw new Error('Không tìm thấy user với email này');
  }

  // Kiểm tra và lọc các hobby đã tồn tại (sử dụng ObjectId)
  const existingHobbies = user.hobbies.map(hobby => hobby.toString()); // Chuyển ObjectId thành chuỗi
  const newHobbies = [];

  for (const hobbyName of hobbies) {
    // Kiểm tra nếu hobby đã tồn tại trong danh sách
    let hobby = await Hobby.findOne({ name: hobbyName });

    if (!hobby) {
      // Nếu hobby chưa tồn tại, tạo mới
      hobby = new Hobby({ name: hobbyName });
      await hobby.save();
    }

    // Nếu hobby chưa có trong user, thêm vào mảng newHobbies
    if (!existingHobbies.includes(hobby._id.toString())) {
      newHobbies.push(hobby._id);
    }
  }

  // Nếu không có hobby mới, ném lỗi
  if (newHobbies.length === 0) {
    throw new Error('Tất cả sở thích đã tồn tại');
  }

  // Thêm các hobby mới vào mảng hobbies của user
  user.hobbies.push(...newHobbies);
  await user.save();

  return {
    email: user.email,
    hobbies: user.hobbies,
  };
};

const getCreatedPages =  async (userId, limit = 5, skip = 0) => {
  // Chuyển đổi limit và skip thành số nguyên
  const limitNum = parseInt(limit, 10);
  const skipNum = parseInt(skip, 10);

  // Tìm user và populate createPages
  const user = await User.findById(userId)
    .populate({
      path: 'pages.createPages',
      populate: {
        path: 'avt',
        model: 'MyPhoto',
        select: 'url' // chỉ lấy trường url để tiết kiệm
      }
    })
    .lean(); // để kết quả là plain JS object


  if (!user) {
    return null; // Trả về null nếu không tìm thấy user
  }

  // Lấy danh sách createPages
  let listPages = user.pages?.createPages || [];

  // Sắp xếp theo số lượng follower (tùy chọn, tương tự getHotPage)
  listPages = listPages.sort((a, b) => (b.follower?.length || 0) - (a.follower?.length || 0));

  // Áp dụng phân trang
  listPages = listPages.slice(skipNum, skipNum + limitNum);

  return listPages;
}

const addSavedLocation = async (userId, savedLocation) => {
  const newLocation = await Location.create(savedLocation);

  if (!newLocation) return {success: false, message: "Không thể tạo địa điểm mới"};

  const updateUser = await User.findByIdAndUpdate(
    userId,
    { $push: { savedLocation: newLocation._id } },
    { new: true }
  );

  if (!updateUser) {
    return { success: false, message: "Không thể cập nhật người dùng" };
  }

  return { success: true, message: "Đã thêm địa điểm", user: updateUser };
}

const deleteSavedLocation = async (userId, savedId) => {
  const deletedLocation = await Location.findByIdAndDelete(savedId);

  if (!deletedLocation) {
    return { success: false, message: "Không tìm thấy địa điểm" };
  }

  const updateUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { savedLocation: savedId } },
    { new: true }
  );

  if (!updateUser) {
    return { success: false, message: "Không thể cập nhật người dùng" };
  }

  return { success: true, message: "Đã xóa địa điểm", user: updateUser };
};

const getAllSavedLocation = async (userId) => {
  const user = await User.findById(userId).select('savedLocation').populate('savedLocation');
  
  if (!user) {
    return { success: false, message: "Không tìm thấy người dùng", savedLocations: [] };
  }

  return { success: true, savedLocations: user.savedLocation };
};

const checkSavedLocation = async (userId, location) => {
  const user = await User.findById(userId).select('savedLocation');

  if (!user) {
    return { success: false, message: "Không tìm thấy người dùng", saved: false };
  }

  // Kiểm tra xem có location nào có latitude & longitude trùng khớp không
  const savedLocation = await Location.findOne({
    _id: { $in: user.savedLocation },
    latitude: location.latitude,
    longitude: location.longitude,
  });

  return { 
    success: true, 
    saved: !!savedLocation, 
    savedLocation 
  };
};

const getAllTrip = async (userId) => {
  const user = await User.findById(userId).select('trips').populate({
    path: 'trips',
    match: { deleteAt: null }, // Lọc ra các trip chưa bị xóa
    populate: [
      { path: 'startAddress' },
      { path: 'listAddress' },
      { path: 'endAddress' }
    ]
  });

  if (!user) {
    return { success: false, message: "Không tìm thấy người dùng", trips: [] };
  }

  return { success: true, trips: user.trips };
};

const createTrip = async (userId, data) => {
  try {
    // Tạo chuyến đi mới
    const newTrip = await tripService.createTrip(data);

    if (newTrip) {
      // Cập nhật danh sách trips của user
      await User.findByIdAndUpdate(
        userId,
        { $push: { trips: newTrip._id } }, // Thêm trip vào mảng trips
        { new: true } // Trả về bản ghi mới sau khi cập nhật
      );

      return { success: true, message: "Tạo chuyến đi thành công", trip: newTrip };
    }

    return { success: false, message: "Không thể tạo chuyến đi" };

  } catch (error) {
    console.error("Lỗi khi tạo chuyến đi:", error);
    return { success: false, message: "Có lỗi khi tạo chuyến đi" };
  }
};



const getUserByAccountId = async (accountId) => {
  const user = await User.findOne({ account: accountId })
    .populate({
      path: 'friends',
      select: '_id displayName avt aboutMe'
    })
    .populate('avt')
    .populate('account', 'email phone role state')
    .lean();

  if (!user) {
    throw new Error('Không tìm thấy user với account ID này');
  }

  return {
    _id: user._id,
    displayName: user.displayName,
    avt: user.avt,
    aboutMe: user.aboutMe,
    account: user.account,
    friends: user.friends,
    createdAt: user.createdAt
  };
};
const getHobbiesByUserId = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate({
        path: 'hobbies',
        select: '_id name' // Chỉ lấy _id và name của hobby
      })
      .lean();

    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    return user.hobbies || [];
  } catch (error) {
    throw new Error(error.message);
  }
};

// Cập nhật hobbies theo userId
const updateHobbiesByUserId = async (userId, hobbies) => {
  try {
    // Kiểm tra đầu vào
    if (!hobbies || !Array.isArray(hobbies) || hobbies.length === 0) {
      throw new Error('Mảng hobbies là bắt buộc và không được rỗng');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Người dùng không tồn tại');
    }

    // Tạo hoặc tìm các hobby trong database
    const hobbyIds = [];
    for (const hobbyName of hobbies) {
      let hobby = await Hobby.findOne({ name: hobbyName });
      if (!hobby) {
        hobby = new Hobby({ name: hobbyName });
        await hobby.save();
      }
      hobbyIds.push(hobby._id);
    }

    // Cập nhật mảng hobbies của user
    user.hobbies = hobbyIds;
    await user.save();

    // Populate lại hobbies để trả về kết quả
    const updatedUser = await User.findById(userId)
      .populate({
        path: 'hobbies',
        select: '_id name'
      })
      .lean();

    return updatedUser.hobbies;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getGroupByGroupName = async ({ limit = 5, skip = 0, groupName, userId } = {}) => {
  try {
    // Validate inputs
    if (!Number.isInteger(limit) || limit < 1) throw new Error('Limit phải là số nguyên dương');
    if (!Number.isInteger(skip) || skip < 0) throw new Error('Skip phải là số không âm');
    if (groupName && typeof groupName !== 'string') throw new Error('GroupName phải là chuỗi');
    if (!userId || typeof userId !== 'string') throw new Error('UserId phải là chuỗi');

    // Fetch user to get their groups
    const user = await User.findById(userId);

    if (!user || !user.groups?.createGroups) {
      console.log('No user or no createGroups, returning empty result');
      return { groups: [], total: 0 };
    }

    // Get IDs of created and saved groups
    const myGroupIds = new Set(user.groups.createGroups.map(group => group._id.toString()));
    const savedGroupIds = new Set(user.groups.saveGroups?.map(group => group._id.toString()) || []);

    // Normalize search term
    let normalizedSearch = '';
    if (groupName) {
      try {
        normalizedSearch = removeVietnameseTones(groupName).toLowerCase();
      } catch (error) {
        console.error('Error in removeVietnameseTones:', error.message);
        throw new Error(`Lỗi chuẩn hóa groupName: ${error.message}`);
      }
    }

    // Fetch all groups
    let allGroups;
    try {
      allGroups = await groupService.getGroups();
    } catch (getGroupsError) {
      console.error('Error in getGroups:', getGroupsError.message);
      throw new Error(`Lỗi khi lấy danh sách nhóm: ${getGroupsError.message}`);
    }

    // Filter out invalid groups
    allGroups = allGroups.filter(group => group && typeof group.groupName === 'string' && group._id);

    // Filter groups by name (if provided)
    if (normalizedSearch) {
      allGroups = allGroups.filter(group => {
        const normalizedGroupName = removeVietnameseTones(group.groupName).toLowerCase();
        return normalizedGroupName.match(new RegExp(`\\b${normalizedSearch}\\w*`, 'i'));
        
      });
    }

    // Sort groups: myGroups first, then savedGroups, then others (alphabetically)
    allGroups.sort((a, b) => {
      const aIsMyGroup = myGroupIds.has(a._id.toString());
      const bIsMyGroup = myGroupIds.has(b._id.toString());
      const aIsSavedGroup = savedGroupIds.has(a._id.toString());
      const bIsSavedGroup = savedGroupIds.has(b._id.toString());

      if (aIsMyGroup && !bIsMyGroup) return -1;
      if (!aIsMyGroup && bIsMyGroup) return 1;
      if (aIsSavedGroup && !bIsSavedGroup) return -1;
      if (!aIsSavedGroup && bIsSavedGroup) return 1;
      const aName = a.groupName || '';
      const bName = b.groupName || '';
      return aName.localeCompare(bName);
    });

    // Calculate total records
    const total = allGroups.length;

    // Apply pagination and select relevant fields
    const paginatedGroupIds = allGroups.slice(skip, skip + limit)
    const paginatedGroups = await Promise.all(paginatedGroupIds.map(groupService.getGroupById));

    return {
      groups: paginatedGroups,
      total,
    };
  } catch (error) {
    console.error('Error in getGroupByGroupName:', error.message);
    throw new Error(`Không thể lấy danh sách nhóm: ${error.message}`);
  }
};

const getFriendLocationArticles = async (currentId) => {
  const user = await User.findById(currentId).select('friends').lean();
  if (!user) return {success: false, message: "Không tìm thấy người dùng"};

  const friendIds = user.friends;

  const articles = await Article.find({
    createdBy: { $in: friendIds },
    scope: "Công khai",
    groupID: null,
  })
    .sort({ createdAt: -1 })
    .populate({
      path: 'createdBy',
      select: '_id displayName avt',
      populate: { path: 'avt' },
    })
    .populate('address')
    .select('createdBy address')
    .lean();

  return {success: true,data: articles};
};


export const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAllUsers,
  deleteUserById,
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
  suggestFriends,
  addHobbyByEmail,
  getCreatedPages,
  addSavedLocation,
  deleteSavedLocation,
  getAllSavedLocation,
  checkSavedLocation,
  getAllTrip,
  createTrip,
  getUserByAccountId,
  getHobbiesByUserId, 
  updateHobbiesByUserId ,
  getUsersByDisplayName,
  getGroupByGroupName,
  getFriendLocationArticles
};
