import reelsService from '../services/reelsService.js';

const getReels = async (req, res) => {
  try {
    let { $limit = 4, $skip = 0 } = req.query; // Sử dụng $limit và $skip
    
    $limit = parseInt($limit);
    $skip = parseInt($skip);
    
    if (isNaN($limit) || $limit < 1) {
      return res.status(400).json({
        success: false,
        data: null,
        message: '$limit phải là số nguyên dương',
      });
    }
    if (isNaN($skip) || $skip < 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: '$skip phải là số nguyên không âm',
      });
    }

    const reels = await reelsService.getReels({
      limit: $limit, // Chuyển thành limit để khớp với reelsService
      skip: $skip,   // Chuyển thành skip
    });
    res.status(200).json({
      success: true,
      data: reels.data,
      total: reels.total,
      message: 'Lấy danh sách reels thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getReelById = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await reelsService.getReelById(id);
    if (!reel) {
      return res.status(404).json({ success: false, data: null, message: 'Reel không tồn tại' });
    }
    res.status(200).json({ success: true, data: reel, message: 'Lấy thông tin reel thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createReel = async (req, res) => {
  try {
    const reel = await reelsService.createReel(req.body, req.files);
    res.status(201).json({ success: true, data: reel, message: 'Tạo reel thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateReelById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReel = await reelsService.updateReelsById(id, req.body);
    if (!updatedReel) {
      return res.status(404).json({ success: false, data: null, message: 'Reel không tồn tại' });
    }
    res.status(200).json({ success: true, data: updatedReel, message: 'Cập nhật reel thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllReels = async (req, res) => {
  try {
    const result = await reelsService.updateAllReels(req.body);
    res.status(200).json({ success: true, data: result, message: 'Cập nhật tất cả reels thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteReelById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReel = await reelsService.deleteReelsById(id);
    if (!deletedReel) {
      return res.status(404).json({ success: false, data: null, message: 'Reel không tồn tại' });
    }
    res.status(200).json({ success: true, data: deletedReel, message: 'Xóa reel thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const { reelId } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'userId là bắt buộc',
      });
    }

    const updatedReel = await reelsService.toggleLike(reelId, userId);

    res.status(200).json({
      success: true,
      data: updatedReel,
      message: 'Thao tác like/unlike thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

const getCommentsByReelId = async (req, res) => {
  try {
    const { reelId } = req.params;
    const comments = await reelsService.getCommentsByReelId(reelId);
    res.status(200).json({ success: true, data: comments, message: 'Lấy danh sách bình luận thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};
const getTotalComments = async (req, res) => {
  try {
    const result = await reelsService.getTotalComments(req.params.reelId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};
export const reelsController = {
  getReels,
  getReelById,
  createReel,
  updateReelById,
  updateAllReels,
  deleteReelById,
  toggleLike,
  getCommentsByReelId,
  getTotalComments
};