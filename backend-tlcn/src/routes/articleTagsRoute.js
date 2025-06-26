import express from 'express';
import articleTagsController from '../controllers/articleTagsController.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Article Tags
 *   description: API quản lý tags bài viết
 */

/**
 * @swagger
 * /article-tags/{articleId}:
 *   post:
 *     summary: Tạo ArticleTag cho bài viết theo articleId
 *     tags: [Article Tags]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần tạo ArticleTag
 *     responses:
 *       201:
 *         description: Tạo ArticleTag thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArticleTag'
 *       400:
 *         description: Lỗi dữ liệu đầu vào hoặc không tìm thấy bài viết
 *       500:
 *         description: Lỗi server
 */
Router.post('/:articleId', articleTagsController.createArticleTagByArticleId);

export const articleTagsRoute = Router;