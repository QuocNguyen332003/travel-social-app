import { articleTagsService } from "../services/articleTagsService.js";


const createArticleTagByArticleId = async (req, res) => {
  try {
    const { articleId } = req.params;

    const result = await articleTagsService.createArticleTagByArticleId(articleId);

    if (!result.success) {
      return res.status(400).json({ success: false, data: null, message: result.message });
    }

    res.status(201).json({ success: true, data: result.data, message: 'Tạo ArticleTag thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

export default {
  createArticleTagByArticleId,
};
