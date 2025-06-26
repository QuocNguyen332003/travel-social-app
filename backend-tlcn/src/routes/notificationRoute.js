import express from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Lấy danh sách thông báo theo trạng thái với phân trang
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người nhận
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [read, unread]
 *         description: Trạng thái của thông báo (read, unread). Bỏ qua để lấy tất cả.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang hiện tại
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng thông báo mỗi trang
 *     responses:
 *       200:
 *         description: Trả về danh sách thông báo phân trang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 message:
 *                   type: string
 */
Router.get('/', notificationController.getNotifications);

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     summary: Lấy thông báo theo ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thông báo cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông báo
 */
Router.get('/:id', verifyToken, notificationController.getNotificationById);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Tạo một thông báo mới
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderId
 *               - receiverId
 *               - message
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: ID của người gửi thông báo
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               receiverId:
 *                 type: string
 *                 description: ID của người nhận thông báo
 *                 example: "60f7ebeb2f8fb814b56fa182"
 *               message:
 *                 type: string
 *                 description: Nội dung thông báo
 *                 example: "Chào bạn! Bạn có thông báo mới."
 *               status:
 *                 type: string
 *                 enum: ['read', 'unread']
 *                 description: Trạng thái thông báo (mặc định là 'unread')
 *                 example: "unread"
 *               groupId:
 *                 type: string
 *                 description: ID của nhóm liên quan (nếu có)
 *                 example: "60f7ebeb2f8fb814b56fa183"
 *               articleId:
 *                 type: string
 *                 description: ID của bài viết liên quan (nếu có)
 *                 example: "60f7ebeb2f8fb814b56fa184"
 *               commentId:
 *                 type: string
 *                 description: ID của bình luận liên quan (nếu có)
 *                 example: "60f7ebeb2f8fb814b56fa185"
 *               relatedEntityType:
 *                 type: string
 *                 enum: ['Group', 'Article', 'Comment', 'User', null]
 *                 description: Loại thực thể liên quan đến thông báo
 *                 example: "User"
 *     responses:
 *       201:
 *         description: Thông báo được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60f7ebeb2f8fb814b56fa186"
 *                     senderId:
 *                       type: string
 *                       example: "60f7ebeb2f8fb814b56fa181"
 *                     receiverId:
 *                       type: string
 *                       example: "60f7ebeb2f8fb814b56fa182"
 *                     message:
 *                       type: string
 *                       example: "Chào bạn! Bạn có thông báo mới."
 *                     status:
 *                       type: string
 *                       example: "unread"
 *                     groupId:
 *                       type: string
 *                       example: "60f7ebeb2f8fb814b56fa183"
 *                     articleId:
 *                       type: string
 *                       example: "60f7ebeb2f8fb814b56fa184"
 *                     commentId:
 *                       type: string
 *                       example: "60f7ebeb2f8fb814b56fa185"
 *                     relatedEntityType:
 *                       type: string
 *                       example: "User"
 *                     readAt:
 *                       type: number
 *                       example: null
 *                     createdAt:
 *                       type: number
 *                       example: 1697050500000
 *                     _destroy:
 *                       type: number
 *                       example: null
 *                 message:
 *                   type: string
 *                   example: "Tạo thông báo thành công"
 *       500:
 *         description: Lỗi server khi tạo thông báo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: null
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Lỗi khi tạo thông báo"
 */
Router.post('/', verifyToken, notificationController.createNotification);

/**
 * @swagger
 * /notifications/{id}:
 *   patch:
 *     summary: Cập nhật thông báo theo ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thông báo cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật thông báo thành công
 */
Router.patch('/:id', verifyToken, notificationController.updateNotificationById);

/**
 * @swagger
 * /notifications:
 *   patch:
 *     summary: Cập nhật tất cả thông báo
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả thông báo thành công
 */
Router.patch('/', verifyToken, notificationController.updateAllNotifications);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Xóa thông báo theo ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thông báo cần xóa
 *     responses:
 *       200:
 *         description: Xóa thông báo thành công
 */
Router.delete('/:id', verifyToken, notificationController.deleteNotificationById);

export const notificationRoute = Router;