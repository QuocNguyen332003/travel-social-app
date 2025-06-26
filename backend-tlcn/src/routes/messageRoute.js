import express from 'express';
import MessageController from '../controllers/messageController.js';
import upload from '../config/multerConfig.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API tin nhắn
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - conversationId
 *         - sender
 *         - content
 *       properties:
 *         conversationId:
 *           type: string
 *           description: ID của cuộc trò chuyện chứa tin nhắn
 *           example: "65d2f3c48bfc3c001fc08b7a"
 *         sender:
 *           type: string
 *           description: ID của người gửi tin nhắn
 *           example: "65d2f3c48bfc3c001fc08b7b"
 *         content:
 *           type: object
 *           description: Nội dung tin nhắn
 *           required:
 *             - contentType
 *           properties:
 *             contentType:
 *               type: string
 *               enum: [img, video, text, record]
 *               description: Loại nội dung của tin nhắn
 *               example: "text"
 *             message:
 *               type: string
 *               description: Nội dung tin nhắn (bắt buộc nếu contentType là "text")
 *               example: "Xin chào!"
 *             mediaUrl:
 *               type: string
 *               description: Đường dẫn media (bắt buộc nếu contentType là "img", "video" hoặc "record")
 *               example: "https://example.com/image.jpg"
 *         seenBy:
 *           type: array
 *           description: Danh sách ID của những người đã xem tin nhắn
 *           items:
 *             type: string
 *           example: ["65d2f3c48bfc3c001fc08b7c", "65d2f3c48bfc3c001fc08b7d"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo tin nhắn
 *           example: "2025-03-08T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật tin nhắn
 *           example: "2025-03-08T12:35:00Z"
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Lấy danh sách tất cả tin nhắn
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: Danh sách tin nhắn
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
Router.get('/',verifyToken, MessageController.getMessages);

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     summary: Lấy một tin nhắn theo ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tin nhắn cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông tin tin nhắn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Không tìm thấy tin nhắn
 */
Router.get('/:id',verifyToken, MessageController.getMessageById);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Gửi tin nhắn mới trong cuộc trò chuyện
 *     tags: [Messages]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *                 description: ID của cuộc trò chuyện
 *                 example: "67cd5014c11e1a41c9c642cc"
 *               sender:
 *                 type: string
 *                 description: ID của người gửi tin nhắn
 *                 example: "67cd4b33637423adf651fc96"
 *               type:
 *                 type: string
 *                 enum: ['img', 'video', 'text', 'record']
 *                 description: Loại nội dung tin nhắn
 *                 example: "img"
 *               message:
 *                 type: string
 *                 description: Nội dung tin nhắn (nếu có)
 *                 example: "Xin chào!"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Tệp tin đính kèm (chỉ bắt buộc nếu type là 'img', 'video' hoặc 'record')
 *     responses:
 *       201:
 *         description: Tạo tin nhắn thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
Router.post('/',verifyToken, upload.single('file'), MessageController.createMessage);

/**
 * @swagger
 * /messages/{id}:
 *   patch:
 *     summary: Cập nhật tin nhắn theo ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tin nhắn cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       200:
 *         description: Cập nhật tin nhắn thành công
 *       404:
 *         description: Không tìm thấy tin nhắn
 */
Router.patch('/:id',verifyToken, MessageController.updateMessageById);

/**
 * @swagger
 * /messages/{id}:
 *   delete:
 *     summary: Xóa tin nhắn theo ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tin nhắn cần xóa
 *     responses:
 *       200:
 *         description: Tin nhắn đã được xóa thành công
 *       404:
 *         description: Không tìm thấy tin nhắn
 */
Router.delete('/:id',verifyToken, MessageController.deleteMessageById);

/**
 * @swagger
 * /messages/of-conversation/{id}:
 *   get:
 *     summary: Lấy tin nhắn của một hộp thoại
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của hộp thoại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         required: false
 *         description: Số lượng tin nhắn tối đa cần lấy
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         required: false
 *         description: Số lượng tin nhắn cần bỏ qua
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công
 *       404:
 *         description: Không tìm thấy tin nhắn
 */
Router.get('/of-conversation/:id',verifyToken, MessageController.getMessagesByConversationId);

/**
 * @swagger
 * /messages/{id}/photo:
 *   get:
 *     summary: Lấy tất cả photo của hộp thoại
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của hộp thoại
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công
 *       404:
 *         description: Không tìm thấy tin nhắn
 */
Router.get('/:id/photo',verifyToken, MessageController.getPhotosByConversation);

/**
 * @swagger
 * /messages/of-conversation/{id}/photo:
 *   get:
 *     summary: Lấy tin nhắn của một hộp thoại (chỉ một loại img hoặc video)
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của hộp thoại
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [img, video]
 *         required: true
 *         description: Loại tin nhắn cần lấy (chỉ 'img' hoặc 'video')
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         required: false
 *         description: Số lượng tin nhắn tối đa cần lấy
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         required: false
 *         description: Số lượng tin nhắn cần bỏ qua
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công
 *       404:
 *         description: Không tìm thấy tin nhắn
 *       500:
 *         description: Lỗi server
 */
Router.get('/of-conversation/:id/photo',verifyToken, MessageController.getMessagePhoto);

/**
 * @swagger
 * /messages/of-conversation/{id}/seen-all:
 *   patch:
 *     summary: Đánh dấu đã đọc tin nhắn
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tin nhắn cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng cần cập nhật setting
 *     responses:
 *       200:
 *         description: Cập nhật tin nhắn thành công
 *       404:
 *         description: Không tìm thấy tin nhắn
 */
Router.patch('/of-conversation/:id/seen-all',verifyToken, MessageController.seenMessage);

export const messageRoute = Router;

