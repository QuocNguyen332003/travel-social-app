import Article from "../models/Article.js";
import Comment from "../models/Comment.js";
import Group from "../models/Group.js";
import Page from "../models/Page.js";
import User from "../models/User.js";
import { myPhotoService } from "./myPhotoService.js";
import {addressService} from "./addressService.js";
import mongoose from 'mongoose';
import { emitEvent } from "../socket/socket.js";
import { articleTagsService } from "./articleTagsService.js";

const getArticles = async ({ limit = 5, skip = 0, filter = {}, province } = {}) => {
  // Thêm _destroy: null vào filter để loại trừ các bài viết bị xóa mềm
  const updatedFilter = { ...filter, _destroy: null };

  let query = Article.find(updatedFilter);

  // Nếu có province, sử dụng pipeline tổng hợp để lọc theo tỉnh
  if (province) {
    query = Article.aggregate([
      // Lọc bài viết dựa trên filter đã cập nhật và _destroy: null
      { $match: updatedFilter },
      // Lookup để liên kết với collection Address
      {
        $lookup: {
          from: 'addresses',
          localField: 'address',
          foreignField: '_id',
          as: 'addressData',
        },
      },
      // Unwind mảng addressData
      { $unwind: { path: '$addressData', preserveNullAndEmptyArrays: true } },
      // Lọc bài viết theo tỉnh
      {
        $match: {
          'addressData.province': province,
          'addressData._destroy': null, // Đã có trong mã của bạn
        },
      },
      // Populate các trường khác
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      { $unwind: '$createdBy' },
      {
        $lookup: {
          from: 'myphotos',
          localField: 'createdBy.avt',
          foreignField: '_id',
          as: 'createdBy.avt',
        },
      },
      { $unwind: { path: '$createdBy.avt', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'myphotos',
          localField: 'listPhoto',
          foreignField: '_id',
          as: 'listPhoto',
        },
      },
      {
        $lookup: {
          from: 'groups',
          localField: 'groupID',
          foreignField: '_id',
          as: 'groupID',
        },
      },
      { $unwind: { path: '$groupID', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'addresses',
          localField: 'address',
          foreignField: '_id',
          as: 'address',
        },
      },
      { $unwind: { path: '$address', preserveNullAndEmptyArrays: true } },
      // Dự án các trường cần thiết
      {
        $project: {
          createdBy: {
            _id: 1,
            displayName: 1,
            avt: { _id: 1, name: 1, idAuthor: 1, type: 1, url: 1, createdAt: 1, updatedAt: 1 },
          },
          listPhoto: {
            $map: {
              input: '$listPhoto',
              as: 'photo',
              in: {
                _id: '$$photo._id',
                name: '$$photo.name',
                idAuthor: '$$photo.idAuthor',
                type: '$$photo.type',
                url: '$$photo.url',
                createdAt: '$$photo.createdAt',
                updatedAt: '$$photo.updatedAt',
              },
            },
          },
          groupID: { _id: 1, groupName: 1 },
          address: {
            _id: 1,
            province: 1,
            district: 1,
            ward: 1,
            street: 1,
            placeName: 1,
            lat: 1,
            long: 1,
          },
          content: 1,
          hashTag: 1,
          scope: 1,
          emoticons: 1,
          comments: 1,
          createdAt: 1,
          updatedAt: 1,
          _destroy: 1,
        },
      },
      // Sắp xếp theo createdAt giảm dần
      { $sort: { createdAt: -1 } },
      // Áp dụng phân trang
      { $skip: skip },
      { $limit: limit },
    ]);

    // Lấy tổng số bài viết để phân trang
    const totalPipeline = [
      { $match: updatedFilter },
      {
        $lookup: {
          from: 'addresses',
          localField: 'address',
          foreignField: '_id',
          as: 'addressData',
        },
      },
      { $unwind: { path: '$addressData', preserveNullAndEmptyArrays: true } },
      {
        $match: {
          'addressData.province': province,
          'addressData._destroy': null,
        },
      },
      { $count: 'total' },
    ];

    const totalResult = await Article.aggregate(totalPipeline);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    // Thực thi truy vấn chính
    const articles = await query;

    return { articles, total };
  }

  // Nếu không có bộ lọc province, sử dụng truy vấn thông thường
  const total = await Article.countDocuments(updatedFilter);

  const articles = await query
    .populate({
      path: 'createdBy',
      select: '_id displayName avt',
      populate: {
        path: 'avt',
        select: '_id name idAuthor type url createdAt updatedAt',
      },
    })
    .populate({
      path: 'listPhoto',
      select: '_id name idAuthor type url createdAt updatedAt',
      populate: {
        path: 'idAuthor',
        select: '_id displayName avt',
      },
    })
    .populate({
      path: 'groupID',
      select: '_id groupName',
    })
    .populate({
      path: 'address',
      select: '_id province district ward street placeName lat long',
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  return { articles, total };
};

const getArticleById = async (id) => {
  return await Article.findOne({ _id: id, _destroy: null })
  .populate({
    path: 'createdBy',
    select: '_id displayName avt ',
    populate: {
      path: 'avt',
      select: '_id name idAuthor type url createdAt updatedAt',
    },
  })
  .populate({
    path: 'listPhoto',
    select: '_id name idAuthor type url createdAt updatedAt',
    populate: {
      path: 'idAuthor',
      select: '_id displayName avt',
    },
  })
  .populate({
    path: 'groupID',
    select: '_id groupName ',
  })
  .populate({
    path: 'address',
    select: '_id province district ward street placeName lat long',
  })
  .sort({ createdAt: -1 });
};

const createArticle = async (data, files) => {
  const startTime = performance.now(); // Bắt đầu đo thời gian
  try {
    const { createdBy, content, hashTag, scope, groupID, pageId, address } = data;

    if (!createdBy || !content) {
      throw new Error("❌ Thiếu thông tin bắt buộc");
    }

    // Xử lý hashtag, mặc định là mảng rỗng nếu không có
    const normalizedHashtags = Array.isArray(hashTag)
      ? hashTag
      : typeof hashTag === "string" && hashTag.trim()
        ? hashTag.split(",").map(tag => tag.trim())
        : [];

    // 🔥 1️⃣ Xử lý địa chỉ nếu có
    let addressId = null;
    if (address) {
      try {
        // Parse the address string if it's a string
        const addressData = typeof address === 'string' ? JSON.parse(address) : address;

        const newAddress = await addressService.createAddress({
          province: addressData.province,
          district: addressData.district,
          ward: addressData.ward,
          street: addressData.street || '', // Ensure street has a default value
          placeName: addressData.placeName ||
            `${addressData.street || ''}, ${addressData.ward}, ${addressData.district}, ${addressData.province}`.trim(),
          lat: addressData.lat,
          long: addressData.long
        });
        addressId = newAddress._id;
      } catch (error) {
        console.error('❌ Lỗi khi tạo địa chỉ:', error);
        // Vẫn tiếp tục tạo bài viết nếu có lỗi địa chỉ
      }
    }

    // 🔥 2️⃣ Tạo bài viết mới
    const newArticle = await Article.create({
      createdBy,
      content,
      hashTag: normalizedHashtags,
      scope,
      groupID: groupID || null,
      address: addressId,
      listPhoto: [],
    });

    // 🔥 3️⃣ Xử lý media
    let uploadedMedia = [];
    if (files && (files.media || files.images)) {
      const allFiles = [...(files.media || []), ...(files.images || [])];

      uploadedMedia = await Promise.all(
        allFiles.map((file) => {
          const fileType = file.mimetype.startsWith("video/") ? "video" : "img";
          return myPhotoService.uploadAndSaveFile(file, createdBy, fileType, "articles", newArticle._id);
        })
      );
    }
    if (uploadedMedia.length > 0) {
      newArticle.listPhoto = uploadedMedia.map((media) => media._id);
      await newArticle.save();
    }

    // 🔥 4️⃣ Cập nhật group/page/user
    if (groupID) {
      const group = await Group.findById(groupID);

      if (!group) {
        throw new Error("❌ Không tìm thấy nhóm");
      }

      const isCreater = group.idCreater.toString() === createdBy.toString();
      const isAdmin = group.Administrators.some(
        (admin) => admin.idUser.toString() === createdBy.toString() && admin.state === 'accepted'
      );
      console.log('isCreater', isCreater)
      console.log('isAdmin', isAdmin)
      let articleState = "pending"; 

      if (isCreater || isAdmin) {
        console.log('isCreater', isCreater)
        articleState = "approved"; 

      }

      await Group.findByIdAndUpdate(
        groupID,
        { $push: { article: { idArticle: newArticle._id, state: articleState } } },
        { new: true }
      );
    }
    if (pageId) {
      await Page.findByIdAndUpdate(
        pageId,
        { $push: { listArticle: newArticle._id } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        createdBy,
        { $push: { articles: newArticle._id } },
        { new: true }
      );
    }

    await articleTagsService.createArticleTagByArticle(newArticle, uploadedMedia);

    const endTime = performance.now(); // Kết thúc đo thời gian
    const processingTime = endTime - startTime; // Tính thời gian xử lý (ms)

    return {
      article: newArticle,
      backendProcessingTime: processingTime.toFixed(2), // Trả về thời gian xử lý (ms)
    };
  } catch (error) {
    console.error("❌ Lỗi chi tiết khi tạo bài viết:", {
      error: error.message,
      stack: error.stack,
      inputData: data
    });
    throw error;
  }
};

const updateArticleById = async (id, data) => {
  return await Article.findByIdAndUpdate(id, data, { new: true, useFindAndModify: false });
};

const updateAllArticles = async (data) => {
  return await Article.updateMany({}, data, { new: true });
};

const deleteArticleById = async (id) => {
  return await Article.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

const toggleLike = async (articleId, userId) => {
  console.log(`articleService.toggleLike: articleId=${articleId}, userId=${userId}`);
  
  const article = await Article.findById(articleId);
  if (!article) {
    console.error(`Article not found: ${articleId}`);
    throw new Error('Bài viết không tồn tại');
  }

  const liked = article.emoticons.includes(userId.toString());
  console.log(`Article liked by user ${userId}: ${liked}`);

  if (liked) {
    article.emoticons = article.emoticons.filter(id => id.toString() !== userId.toString());
  } else {
    article.emoticons.push(userId);
  }

  await article.save().catch((err) => {
    console.error(`Error saving article ${articleId}:`, err);
    throw new Error('Failed to save article');
  });

  return article;
};

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

const getCommentsByArticleId = async (articleId) => {
  const article = await Article.findById(articleId)
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

  if (!article || !article.comments) return [];

  let comments = article.comments;

  // Gọi hàm đệ quy để lấy tất cả bình luận con (nếu cần)
  comments = await deepPopulateComments(comments);

  return comments;
};

const getArticlesByProvinceId = async ({ provinceId, limit = 5, skip = 0 } = {}) => {
  try {
    const province = await mongoose.model('Province').findById(provinceId).select('listPage');
    if (!province || !province.listPage || province.listPage.length === 0) {
      return { articles: [], total: 0 };
    }

    const pages = await Page.find({
      _id: { $in: province.listPage },
      deleteAt: null,
    }).select('listArticle');

    const articleIds = pages.reduce((acc, page) => {
      return acc.concat(page.listArticle);
    }, []);
    if (articleIds.length === 0) {
      return { articles: [], total: 0 };
    }

    // Query articles with pagination
    const articles = await Article.find({
      _id: { $in: articleIds },
      _destroy: null,
    })
      .populate({
        path: 'createdBy',
        select: '_id displayName avt',
        populate: {
          path: 'avt',
          select: '_id name idAuthor type url createdAt updatedAt',
        },
      })
      .populate({
        path: 'listPhoto',
        select: '_id name idAuthor type url createdAt updatedAt',
        populate: {
          path: 'idAuthor',
          select: '_id displayName avt',
        },
      })
      .populate({
        path: 'groupID',
        select: '_id groupName',
      })
      .populate({
        path: 'address',
        select: '_id province district ward street placeName lat long',
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Get total count for pagination
    const total = await Article.countDocuments({
      _id: { $in: articleIds },
      _destroy: null,
    });

    return { articles, total };
  } catch (error) {
    throw new Error(`Lỗi khi lấy bài viết theo provinceId: ${error.message}`);
  }
};


export const articleService = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticleById,
  updateAllArticles,
  deleteArticleById,
  toggleLike,
  getCommentsByArticleId,
  getArticlesByProvinceId
};
