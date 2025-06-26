import express from 'express';
import HistoryArticleController from '../controllers/historyArticleController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HistoryArticles
 *   description: API quản lý lịch sử xem bài viết
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HistoryArticle:
 *       type: object
 *       required:
 *         - idUser
 *         - idArticle
 *       properties:
 *         idUser:
 *           type: string
 *           description: ID của người dùng đã xem bài viết
 *           example: "user123"
 *         idArticle:
 *           type: string
 *           description: ID của bài viết đã xem
 *           example: "article456"
 *         viewDate:
 *           type: string
 *           format: date-time
 *           description: Ngày xem bài viết
 *           example: "2025-02-20T12:34:56.789Z"
 */

/**
 * @swagger
 * /history-article:
 *   get:
 *     summary: Lấy danh sách tất cả lịch sử xem bài viết
 *     tags: [HistoryArticles]
 *     responses:
 *       200:
 *         description: Danh sách lịch sử xem bài viết
 */
Router.get('/',verifyToken, HistoryArticleController.getHistoryArticles);

/**
 * @swagger
 * /history-article/{id}:
 *   get:
 *     summary: Lấy thông tin lịch sử xem bài viết theo ID
 *     tags: [HistoryArticles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của lịch sử xem bài viết cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông tin lịch sử xem bài viết
 *       404:
 *         description: Không tìm thấy lịch sử xem bài viết
 */
Router.get('/:id',verifyToken, HistoryArticleController.getHistoryArticleById);

/**
 * @swagger
 * /history-article:
 *   post:
 *     summary: Tạo một lịch sử xem bài viết mới
 *     tags: [HistoryArticles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistoryArticle'
 *     responses:
 *       201:
 *         description: Lịch sử xem bài viết được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.post('/',verifyToken, HistoryArticleController.createHistoryArticle);

/**
 * @swagger
 * /history-article/{id}:
 *   patch:
 *     summary: Cập nhật một lịch sử xem bài viết theo ID
 *     tags: [HistoryArticles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistoryArticle'
 *     responses:
 *       200:
 *         description: Cập nhật thành công lịch sử xem bài viết
 *       404:
 *         description: Không tìm thấy lịch sử xem bài viết
 */
Router.patch('/:id',verifyToken, HistoryArticleController.updateHistoryArticleById);

/**
 * @swagger
 * /history-article:
 *   patch:
 *     summary: Cập nhật tất cả lịch sử xem bài viết
 *     tags: [HistoryArticles]
 *     responses:
 *       200:
 *         description: Cập nhật thành công tất cả lịch sử xem bài viết
 */
Router.patch('/',verifyToken, HistoryArticleController.updateAllHistoryArticles);

/**
 * @swagger
 * /history-article/{id}:
 *   delete:
 *     summary: Xóa một lịch sử xem bài viết theo ID
 *     tags: [HistoryArticles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lịch sử xem bài viết đã được xóa thành công
 *       404:
 *         description: Không tìm thấy lịch sử xem bài viết
 */
Router.delete('/:id',verifyToken, HistoryArticleController.deleteHistoryArticleById);

export const historyArticledRoute = Router;
