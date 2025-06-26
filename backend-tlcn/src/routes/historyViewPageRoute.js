import express from 'express';
import HistoryViewPageController from '../controllers/historyViewPageController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HistoryViewPages
 *   description: API quản lý lịch sử xem bài viết
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HistoryViewPage:
 *       type: object
 *       required:
 *         - idUser
 *         - idPage
 *       properties:
 *         idUser:
 *           type: string
 *           description: ID của người dùng đã xem bài viết
 *           example: "user123"
 *         idPage:
 *           type: string
 *           description: ID của bài viết đã xem
 *           example: "article456"
 */

/**
 * @swagger
 * /history-page:
 *   get:
 *     summary: Lấy danh sách tất cả lịch sử xem bài viết
 *     tags: [HistoryViewPages]
 *     responses:
 *       200:
 *         description: Danh sách lịch sử xem bài viết
 */
Router.get('/',verifyToken, HistoryViewPageController.getHistoryViewPages);

/**
 * @swagger
 * /history-page/{id}:
 *   get:
 *     summary: Lấy thông tin lịch sử xem bài viết theo ID
 *     tags: [HistoryViewPages]
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
Router.get('/:id',verifyToken, HistoryViewPageController.getHistoryViewPageById);

/**
 * @swagger
 * /history-page:
 *   post:
 *     summary: Tạo một lịch sử xem bài viết mới
 *     tags: [HistoryViewPages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistoryViewPage'
 *     responses:
 *       201:
 *         description: Lịch sử xem bài viết được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.post('/',verifyToken, HistoryViewPageController.createHistoryViewPage);

/**
 * @swagger
 * /history-page/{id}:
 *   patch:
 *     summary: Cập nhật một lịch sử xem bài viết theo ID
 *     tags: [HistoryViewPages]
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
 *             $ref: '#/components/schemas/HistoryViewPage'
 *     responses:
 *       200:
 *         description: Cập nhật thành công lịch sử xem bài viết
 *       404:
 *         description: Không tìm thấy lịch sử xem bài viết
 */
Router.patch('/:id',verifyToken, HistoryViewPageController.updateHistoryViewPageById);

/**
 * @swagger
 * /history-page:
 *   patch:
 *     summary: Cập nhật tất cả lịch sử xem bài viết
 *     tags: [HistoryViewPages]
 *     responses:
 *       200:
 *         description: Cập nhật thành công tất cả lịch sử xem bài viết
 */
Router.patch('/',verifyToken, HistoryViewPageController.updateAllHistoryViewPages);

/**
 * @swagger
 * /history-page/{id}:
 *   delete:
 *     summary: Xóa một lịch sử xem bài viết theo ID
 *     tags: [HistoryViewPages]
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
Router.delete('/:id',verifyToken, HistoryViewPageController.deleteHistoryViewPageById);

/**
 * @swagger
 * /history-page/user/{id}:
 *   get:
 *     summary: Lấy thông tin lịch sử xem bài viết theo ID
 *     tags: [HistoryViewPages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về thông tin lịch sử xem bài viết
 *       404:
 *         description: Không tìm thấy lịch sử xem bài viết
 */
Router.get('/user/:id',verifyToken, HistoryViewPageController.getViewByUserId);

export const historyViewPagedRoute = Router;
