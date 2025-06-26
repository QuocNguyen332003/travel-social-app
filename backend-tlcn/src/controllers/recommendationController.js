// controllers/recommendationController.js
import { recommendationService } from '../services/recommendationService.js';

const getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'ID người dùng không hợp lệ'
      });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Page và limit phải lớn hơn 0'
      });
    }
    // Gọi service lấy kết quả gợi ý
    const { articles, totalPages, currentPage, scoredArticlesDetails } = await recommendationService.recommend(userId, page, limit);

    res.status(200).json({
      success: true,
      data: {
        articles,
        totalPages,
        currentPage,
        scoredArticlesDetails // Trả về chi tiết điểm số từng bài
      },
      message: 'Lấy danh sách bài viết gợi ý thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message
    });
  }
};

export const recommendationController = {
  getRecommendations
};