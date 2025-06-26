import express from 'express';
import { reportController } from '../controllers/reportController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 */

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Lấy danh sách báo cáo
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Trả về danh sách báo cáo
 */
Router.get('/',verifyToken, reportController.getReports);

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Lấy báo cáo theo ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của báo cáo cần lấy
 *     responses:
 *       200:
 *         description: Trả về báo cáo
 */
Router.get('/:id',verifyToken, reportController.getReportById);

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Tạo báo cáo mới và gán vào bài viết
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [_idReporter, reason, articleId] # Đảm bảo articleId là bắt buộc
 *             properties:
 *               _idReporter:
 *                 type: string
 *                 description: ID của người báo cáo
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               reason:
 *                 type: string
 *                 description: Lý do báo cáo
 *                 example: "Nội dung vi phạm"
 *               articleId:
 *                 type: string
 *                 description: ID của bài viết bị báo cáo
 *                 example: "65d1e6b8f5a1a3f1a9b1c679"
 *               status:
 *                 type: string
 *                 enum: ['pending', 'accepted', 'rejected']
 *                 default: "pending"
 *                 example: "pending"
 *     responses:
 *       201:
 *         description: Báo cáo được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: { type: string, example: "65d1e7b8f5a1a3f1a9b1c680" }
 *                     _idReporter: { type: string, example: "60f7ebeb2f8fb814b56fa181" }
 *                     reason: { type: string, example: "Nội dung vi phạm" }
 *                     reportDate: { type: string, format: date-time, example: "2025-02-20T10:30:00.000Z" }
 *                     status: { type: string, example: "pending" }
 *                 message: { type: string, example: "Tạo báo cáo thành công" }
 *       400:
 *         description: Thiếu thông tin (_idReporter, reason, articleId)
 *       500:
 *         description: Lỗi máy chủ
 */
Router.post('/',verifyToken, reportController.createReport);


/**
 * @swagger
 * /reports/{id}:
 *   patch:
 *     summary: Cập nhật báo cáo theo ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của báo cáo cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật báo cáo thành công
 */
Router.patch('/:id',verifyToken, reportController.updateReportById);

/**
 * @swagger
 * /reports:
 *   patch:
 *     summary: Cập nhật tất cả báo cáo
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả báo cáo thành công
 */
Router.patch('/',verifyToken, reportController.updateAllReports);

/**
 * @swagger
 * /reports/{id}:
 *   delete:
 *     summary: Xóa báo cáo theo ID
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của báo cáo cần xóa
 *     responses:
 *       200:
 *         description: Xóa báo cáo thành công
 */
Router.delete('/:id',verifyToken, reportController.deleteReportById);

export const reportRoute = Router;
