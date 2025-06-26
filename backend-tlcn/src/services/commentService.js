import Comment from "../models/Comment.js";
import Article from "../models/Article.js";
import { articleService } from "./articleService.js";
import reelsService from "./reelsService.js";
import { myPhotoService } from "./myPhotoService.js";
import mongoose from "mongoose";
import { emitEvent } from "../socket/socket.js";
import Reels from "../models/Reels.js";
const getComments = async () => {
  return await Comment.find({ _destroy: null })
    .populate({
      path: "_iduser",
      select: "displayName avt",
      populate: { path: "avt", select: "url" },
    })
    .populate({
      path: "replyComment",
      populate: {
        path: "_iduser",
        select: "displayName avt",
        populate: { path: "avt", select: "url" },
      },
    })
    .populate({
      path: "img", // Populate trường img
      select: "url type", // Chỉ lấy url và type từ MyPhoto
    });
};

const getCommentById = async (id) => {
  return await Comment.findOne({ _id: id, _destroy: null })
    .populate({
      path: "_iduser",
      select: "displayName avt",
      populate: { path: "avt", select: "url" },
    })
    .populate({
      path: "replyComment",
      populate: [
        {
          path: "_iduser",
          select: "displayName avt",
          populate: { path: "avt", select: "url" },
        },
        {
          path: "replyComment", // Populate đệ quy
          populate: {
            path: "_iduser",
            select: "displayName avt",
            populate: { path: "avt", select: "url" },
          },
        },
      ],
    })
    .populate({
      path: "img",
      select: "url type",
    });
};

const createComment = async (data, files) => {
  const { _iduser, content, img, articleId, replyComment } = data;

  const allFiles = [...(files?.media || []), ...(files?.images || [])];
  if (allFiles.length > 1) {
    throw new Error("Chỉ được phép đính kèm tối đa 1 ảnh hoặc video");
  }
  const newCommentData = {
    _iduser,
    content,
    img: img || [],
    
  };

  let newComment, article;

  if (articleId && !replyComment) {
    article = await articleService.getArticleById(articleId);
    if (article) {
      newComment = await Comment.create(newCommentData);
      article.comments.push(newComment._id);
      await article.save();
    } else {
      const reel = await reelsService.getReelById(articleId);
      if (!reel) {
        throw new Error("Bài viết hoặc reel không tồn tại");
      }
      newComment = await Comment.create(newCommentData);
      reel.comments.push(newComment._id);
      await reel.save();
    }

    const populatedComment = await getCommentById(newComment._id);
    if (!populatedComment) {
      throw new Error("Không thể lấy dữ liệu bình luận vừa tạo");
    }

    emitEvent("post", articleId, "newComment", {
      comment: populatedComment,
      articleId,
    });
  } else if (replyComment) {
    const parentComment = await Comment.findById(replyComment);
    if (!parentComment) {
      throw new Error("Bình luận cha không tồn tại");
    }

    newComment = await Comment.create(newCommentData);
    parentComment.replyComment.push(newComment._id);
    await parentComment.save();

    const { article: foundArticle } = await findTopLevelCommentAndArticle(replyComment);
    if (!foundArticle) {
      throw new Error("Không thể tìm thấy bài viết liên quan đến bình luận");
    }
    article = foundArticle;

    const populatedComment = await getCommentById(newComment._id);
    if (!populatedComment) {
      throw new Error("Không thể lấy dữ liệu bình luận vừa tạo");
    }

    emitEvent("post", article._id, "newReplyComment", {
      comment: populatedComment,
      parentCommentId: replyComment,
    });
  } else {
    throw new Error("Cần có `articleId` hoặc `replyComment` để tạo bình luận");
  }

  let uploadedMedia = [];
  if (allFiles.length > 0) {
    const file = allFiles[0];
    const fileType = file.mimetype.startsWith("video/") ? "video" : "img";
    const uploadedFile = await myPhotoService.uploadAndSaveFile(
      file,
      _iduser,
      fileType,
      "comments",
      newComment._id
    );
    uploadedMedia = [uploadedFile];
    newComment.img = uploadedMedia.map((media) => media._id);
    await newComment.save();

    const populatedComment = await getCommentById(newComment._id);
    if (!populatedComment) {
      throw new Error("Không thể lấy dữ liệu bình luận sau khi cập nhật media");
    }

    if (articleId && !replyComment) {
      emitEvent("post", articleId, "newComment", {
        comment: populatedComment,
        articleId,
      });
    } else if (replyComment && article) {
      emitEvent("post", article._id, "newReplyComment", {
        comment: populatedComment,
        parentCommentId: replyComment,
      });
    }
  }

  const finalComment = await getCommentById(newComment._id);
  return finalComment;
};

const updateCommentById = async (id, data) => {
  return await Comment.findByIdAndUpdate(id, data, { new: true })
};

const updateAllComments = async (data) => {
  return await Comment.updateMany({}, data, { new: true });
};

const deleteCommentById = async (id) => {
  return await Comment.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

const findTopLevelCommentAndArticle = async (commentId) => {
  let currentCommentId = commentId;
  let parentComment;
  let depth = 0;

  while (true) {
    parentComment = await Comment.findOne({ replyComment: currentCommentId });
    if (!parentComment) {
      const article = await Article.findOne({ comments: currentCommentId });
      if (!article) {
        console.warn(`Không tìm thấy bài viết cho commentId: ${commentId} tại độ sâu: ${depth}`);
        return { topLevelCommentId: currentCommentId, article: null };
      }
      return { topLevelCommentId: currentCommentId, article };
    }
    currentCommentId = parentComment._id;
    depth++;
    if (depth > 10) {
      console.error(`Phát hiện vòng lặp tiềm ẩn cho commentId: ${commentId}`);
      return { topLevelCommentId: null, article: null };
    }
  }
};

const likeComment = async (commentId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return { success: false, data: null, message: "ID bình luận không hợp lệ" };
  }

  const comment = await getCommentById(commentId);
  if (!comment) {
    return { success: false, data: null, message: "Bình luận không tồn tại" };
  }

  const hasLiked = comment.emoticons.includes(userId);
  if (hasLiked) {
    comment.emoticons = comment.emoticons.filter((id) => id.toString() !== userId);
  } else {
    comment.emoticons.push(userId);
  }

  await comment.save();

  // Serialize emoticons as strings
  const serializedComment = {
    ...comment.toObject(),
    emoticons: comment.emoticons.map((id) => id.toString()),
  };

  // Find the top-level comment and article
  const { article } = await findTopLevelCommentAndArticle(commentId);

  if (article) {
    emitEvent("post", article._id, "commentLiked", {
      commentId,
      userId,
      emoticons: comment.emoticons.map((id) => id.toString()),
    });
  } else {
    console.warn(`No article found for commentId: ${commentId}`);
  }

  return {
    success: true,
    data: serializedComment,
    message: "Cập nhật like/unlike thành công",
  };
};



export const commentService = {
  getComments,
  getCommentById,
  createComment,
  updateCommentById,
  updateAllComments,
  deleteCommentById,
  likeComment,
};
