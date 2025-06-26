import express from 'express';
import AddFriendController from '../controllers/addFriendController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Add-Friends
 */

/**
 * @swagger
 * /add-friends:
 *   get:
 *     summary: Lấy tất cả danh sách kết bạn
 *     tags: [Add-Friends]
 *     responses:
 *       200:
 *         description: Danh sách tất cả lời mời kết bạn
 */
Router.get('/',verifyToken, AddFriendController.getAddFriends);

/**
 * @swagger
 * /add-friends/{id}:
 *   get:
 *     summary: Lấy lời mời kết bạn theo id
 *     tags: [Add-Friends]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id của lời mời
 *     responses:
 *       200:
 *         description: Tìm thấy lời mời phù hợp
 *       404:
 *         description: Không tìm thấy
 */
Router.get('/:id',verifyToken, AddFriendController.getAddFriendById);

/**
 * @swagger
 * /add-friends:
 *   post:
 *     summary: Gửi yêu cầu kết bạn
 *     tags: [Add-Friends]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderId
 *               - receiverId
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: ID của người gửi yêu cầu
 *                 example: "user123"
 *               receiverId:
 *                 type: string
 *                 description: ID của người nhận yêu cầu
 *                 example: "user456"
 *               message:
 *                 type: string
 *                 description: Tin nhắn kèm theo yêu cầu kết bạn (tùy chọn)
 *                 example: "Hey, let's connect!"
 *     responses:
 *       201:
 *         description: Yêu cầu kết bạn được tạo thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 */
Router.post('/',verifyToken, AddFriendController.createAddFriend);

/**
 * @swagger
 * /add-friends/{id}:
 *   patch:
 *     summary: Cập nhật lời mời theo id
 *     tags: [Add-Friends]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id của lời mời
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              status:
 *                 type: string
 *                 enum: [approved, pending, rejected]
 *                 description: Trạng thái của yêu cầu kết bạn
 *                 example: "pending"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy yêu cầu
 */
Router.patch('/:id',verifyToken, AddFriendController.updateAddFriendById);

/**
 * @swagger
 * /add-friends:
 *   patch:
 *     summary: Cập nhật thất cả yêu cầu kết bạn
 *     tags: [Add-Friends]
 *     responses:
 *       200:
 *         description: All friend requests updated
 */
Router.patch('/',verifyToken, AddFriendController.updateAllAddFriends);

/**
 * @swagger
 * /add-friends/{id}:
 *   delete:
 *     summary: Xóa yêu cầu theo id
 *     tags: [Add-Friends]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Friend request deleted
 *       404:
 *         description: Friend request not found
 */
Router.delete('/:id',verifyToken, AddFriendController.deleteAddFriendById);

/**
 * @swagger
 * /add-friends/sender/{id}:
 *   get:
 *     summary: Lấy tất cả lời mời kết bạn theo id người gửi
 *     tags: [Add-Friends]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id của người gửi
 *     responses:
 *       200:
 *         description: Tìm thấy lời mời phù hợp
 *       404:
 *         description: Không tìm thấy
 */
Router.get('/sender/:id',verifyToken, AddFriendController.getAddFriendBySenderId);

/**
 * @swagger
 * /add-friends/receive/{id}:
 *   get:
 *     summary: Lấy tất cả lời mời kết bạn theo id người nhận
 *     tags: [Add-Friends]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id của người nhận
 *     responses:
 *       200:
 *         description: Tìm thấy lời mời phù hợp
 *       404:
 *         description: Không tìm thấy
 */
Router.get('/receive/:id',verifyToken, AddFriendController.getAddFriendByReceiverId);

export const addFriendRoute = Router;
