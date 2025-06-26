import Reels from '../models/Reels.js';
import User from "../models/User.js";
import { myPhotoService } from "./myPhotoService.js";
import Comment from "../models/Comment.js";
import mongoose from 'mongoose';
import { emitEvent } from "../socket/socket.js";
const getAll = async () => {
    return await Reels.find();
};

const getReels = async ({ limit = 4, skip=0 } = {}) => {
  try {
    const query = { destroyAt: null };
    const reels = await Reels.find(query)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'createdBy',
        select: '_id displayName avt',
        populate: {
          path: 'avt',
          select: '_id name idAuthor type url createdAt updatedAt',
        },
      })
      .populate({
        path: 'photo', // Chỉ có một photo thay vì listPhoto
        select: '_id name idAuthor type url createdAt updatedAt',
        populate: {
          path: 'idAuthor',
          select: '_id displayName avt',
        },
      })
      .populate({
        path: 'address',
        select: '_id province district ward street placeName lat long',
      })
      .populate({
        path: 'emoticons', // Populate danh sách người thích
        select: '_id displayName avt',
        populate: {
          path: 'avt',
          select: '_id name idAuthor type url createdAt updatedAt',
        },
      })
      .populate({
        path: 'comments', // Populate danh sách bình luận
        match: { _destroy: null }, // Chỉ lấy bình luận chưa bị xóa
        select: '_id content _iduser createdAt',
        populate: {
          path: '_iduser',
          select: '_id displayName avt',
          populate: {
            path: 'avt',
            select: '_id url',
          },
        },
      })
      .sort({ createdAt: -1 });

    const total = await Reels.countDocuments(query);


    return {
      success: true,
      data: reels || [], // Đảm bảo data luôn là mảng
      total: total || 0, // Đảm bảo total luôn có giá trị
      message: 'Lấy danh sách reels thành công',
    };
  } catch (error) {
    console.error('Error fetching reels:', error);
    return {
      success: false,
      data: [],
      total: 0,
      message: `Lỗi khi lấy danh sách reels: ${error.message}`,
    };
  }
};
  const createReel = async (data, files) => {
    try {
      const { createdBy, hashTag, scope, content } = data;
  
      // Kiểm tra các trường bắt buộc
      if (!createdBy) {
        throw new Error("❌ Thiếu thông tin người tạo (createdBy)");
      }
  
      // Chuẩn hóa hashtag (nếu là chuỗi thì split, nếu là mảng thì giữ nguyên)
      const normalizedHashtags = Array.isArray(hashTag)
        ? hashTag
        : hashTag?.split(",").map((tag) => tag.trim()) || [];
  
      // 1️⃣ Tạo reel mới (chưa có media)
      const newReel = await Reels.create({
        createdBy,
        hashTag: normalizedHashtags,
        scope,
        content,
        photo: null, // Sẽ cập nhật sau khi upload file
      });
  
      // 2️⃣ Xử lý file media (nếu có)
      if (!files || !files.media) {
        throw new Error("❌ Phải cung cấp file video cho reel");
      }
  
      // Kiểm tra nếu files.media là mảng hoặc không phải object đơn
      const file = Array.isArray(files.media) ? files.media[0] : files.media;
  
      // Giới hạn chỉ nhận 1 file
      if (Array.isArray(files.media) && files.media.length > 1) {
        throw new Error("❌ Chỉ được upload duy nhất 1 file video cho reel");
      }
  
      // Kiểm tra nếu file không phải video
      if (!file || !file.mimetype || !file.mimetype.startsWith("video/")) {
        throw new Error("❌ Chỉ chấp nhận file video cho reel");
      }
  
      const fileType = "video";
  
      // Upload file video
      const uploadedMedia = await myPhotoService.uploadAndSaveFile(
        file,
        createdBy,
        fileType,
        "reels",
        newReel._id
      );
  
      // Cập nhật trường photo trong reel
      if (uploadedMedia) {
        newReel.photo = uploadedMedia._id;
        await newReel.save();
      }
  
      // 3️⃣ Cập nhật danh sách reels của người dùng
      await User.findByIdAndUpdate(
        createdBy,
        { $push: { reels: newReel._id } }, // Giả sử User có trường "reels"
        { new: true }
      );
  
      // Trả về reel đã tạo
      return newReel;
    } catch (error) {
      throw error;
    }
  };
const updateReelsById = async (id, data) => {
    return await Reels.findByIdAndUpdate(id, data, { new: true })
}

const updateAllReels = async (data) => {
    return await Reels.updateMany({}, data, { new: true })
}

const deleteReelsById = async (id) => {
    return await Reels.findByIdAndDelete(id)
}
const toggleLike = async (reelId, userId) => {
    const reel = await Reels.findById(reelId);
  
    if (!reel) {
      throw new Error('Reel không tồn tại');
    }
  
    const liked = reel.emoticons.includes(userId);
  
    if (liked) {
      reel.emoticons = reel.emoticons.filter(id => id.toString() !== userId.toString());
    } else {
      reel.emoticons.push(userId);
    }
    emitEvent("post", reelId, "postLiked", {
    reelId,
    userId,
    emoticons: reelId.emoticons, // Gửi danh sách emoticons mới
  });
    await reel.save();
  
    return reel;
  };
  
  // 2. Hàm đệ quy để populate bình luận và bình luận con
const deepPopulateComments = async (comments) => {
  if (!comments || comments.length === 0) return comments;

  // Populate img và replyComment cho các bình luận con nếu cần
  const populatedComments = await mongoose.model('Comment').populate(comments, [
    { path: "img", select: "url type", match: { _destroy: null } },
    {
      path: "replyComment",
      match: { _destroy: null },
      populate: [
        { path: "img", select: "url type", match: { _destroy: null } },
        { path: "_iduser", select: "displayName avt", populate: { path: "avt", select: "url" } },
      ],
    },
  ]);

  // Đệ quy cho replyComment
  for (let comment of populatedComments) {
    if (comment.replyComment && comment.replyComment.length > 0) {
      comment.replyComment = await deepPopulateComments(comment.replyComment);
    }
  }

  return populatedComments;
};
  
  // 3. Lấy danh sách bình luận theo reelId
  const getCommentsByReelId = async (reelId) => {
    const reel = await Reels.findById(reelId)
      .populate({
        path: "comments",
        match: { _destroy: null },
        populate: [
          {
            path: "_iduser",
            select: "displayName avt",
            populate: { path: "avt", select: "url" },
          },
          {
            path: "replyComment",
            match: { _destroy: null },
            // Populate img trong replyComment
            populate: {
              path: "img",
              select: "url type",
              match: { _destroy: null }, // Chỉ lấy media chưa bị xóa
            },
          },
          {
            path: "img", // Populate img trong comments chính
            select: "url type",
            match: { _destroy: null }, // Chỉ lấy media chưa bị xóa
          },
        ],
      })
      .select("comments");
  
    if (!reel || !reel.comments) return [];
  
    let comments = reel.comments;
  
    // Gọi hàm đệ quy để lấy tất cả bình luận con
    comments = await deepPopulateComments(comments);
  
    return comments;
  };
  const getReelById = async (reelId) => {
      return await Reels.findOne({ _id: reelId, _destroy: null })
        .populate({
          path: 'createdBy',
          select: '_id displayName avt',
          populate: {
            path: 'avt',
            select: '_id name idAuthor type url createdAt updatedAt',
          },
        })
        .populate({
          path: 'photo', // Chỉ có một photo thay vì listPhoto
          select: '_id name idAuthor type url createdAt updatedAt',
          populate: {
            path: 'idAuthor',
            select: '_id displayName avt',
          },
        })
        .populate({
          path: 'address',
          select: '_id province district ward street placeName lat long',
        })
        .sort({ createdAt: -1 });
  };
const countAllChildComments = async (commentIds) => {
  if (!commentIds || commentIds.length === 0) return 0;

  // Tìm tất cả comment cha có _id trong commentIds và populate replyComment
  const comments = await Comment.find({
    _id: { $in: commentIds },
    _destroy: null,
  }).populate({
    path: 'replyComment',
    match: { _destroy: null }, // Chỉ lấy comment con chưa bị xóa
    select: '_id replyComment', // Chỉ lấy _id và replyComment để tối ưu
  });

  let total = comments.length;

  // Tính comment con của các comment con
  for (const comment of comments) {
    if (comment.replyComment && comment.replyComment.length > 0) {
      const childCommentIds = comment.replyComment.map(child => child._id);
      total += await countAllChildComments(childCommentIds);
    }
  }

  return total;
};

const getTotalComments = async (reelId) => {
  try {
    // Kiểm tra reelId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(reelId)) {
      throw new Error("ID reel không hợp lệ");
    }

    // Tìm reel theo ID và populate comments cấp 1
    const reel = await Reels.findById(reelId).populate({
      path: "comments",
      match: { _destroy: null }, // Chỉ lấy comment chưa bị xóa
      select: '_id replyComment', // Chỉ lấy _id và replyComment để tối ưu
    });
    if (!reel) {
      throw new Error("Reel không tồn tại");
    }

    // Tính tổng số comment cấp 1
    let totalComments = reel.comments.length;

    // Tính tổng số comment con (bao gồm tất cả cấp sâu hơn)
    if (reel.comments.length > 0) {
      const commentIds = reel.comments.map(comment => comment._id);
      const totalChildComments = await countAllChildComments(commentIds);
      totalComments += totalChildComments - reel.comments.length; // Trừ số comment cấp 1 đã tính
    }

    return {
      success: true,
      data: totalComments,
      message: "Lấy tổng số comment thành công",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message,
    };
  }
};
  const reelsService = {
    getReels,
    createReel,
    updateReelsById,
    toggleLike,
    getCommentsByReelId,
    updateAllReels,
    deleteReelsById,
    getReelById,
    getTotalComments
  };
  
  export default reelsService; // Default export
