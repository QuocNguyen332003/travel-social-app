import express from 'express';
import ConversationController from '../controllers/conversationController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
import upload from '../config/multerConfig.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: API quản lý cuộc trò chuyện
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Conversation:
 *       type: object
 *       required:
 *         - type
 *         - _user
 *         - content
 *       properties:
 *         type:
 *           type: string
 *           enum: [friend, group, page]
 *           description: Loại cuộc trò chuyện (Bạn bè, Nhóm, Trang)
 *           example: "friend"
 *         _user:
 *           type: array
 *           description: Danh sách người tham gia cuộc trò chuyện
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [user, page]
 *                 description: Loại người tham gia (Người dùng hoặc Trang)
 *                 example: "user"
 *               _id:
 *                 type: string
 *                 description: ID của người tham gia
 *                 example: "user123"
 *         content:
 *           type: array
 *           description: Lịch sử tin nhắn trong cuộc trò chuyện
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người gửi tin nhắn
 *                 example: "user456"
 *               message:
 *                 type: string
 *                 description: Nội dung tin nhắn
 *                 example: "Xin chào, bạn khỏe không?"
 *               sendDate:
 *                 type: number
 *                 description: Thời gian gửi tin nhắn (timestamp)
 *                 example: 1708411234567
 */

/**
 * @swagger
 * /conversations:
 *   get:
 *     summary: Lấy danh sách tất cả cuộc trò chuyện
 *     tags: [Conversations]
 *     responses:
 *       200:
 *         description: Danh sách cuộc trò chuyện
 */
Router.get('/',verifyToken, ConversationController.getConversations);

/**
 * @swagger
 * /conversations/{id}:
 *   get:
 *     summary: Lấy thông tin một cuộc trò chuyện theo ID
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc trò chuyện cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông tin cuộc trò chuyện
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
Router.get('/:id',verifyToken, ConversationController.getConversationById);

/**
 * @swagger
 * /conversations/with-friend/{id}:
 *   get:
 *     summary: Lấy thông tin một cuộc trò chuyện theo userId và friendId
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc trò chuyện cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông tin cuộc trò chuyện
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
Router.get('/with-friend/:id',verifyToken, ConversationController.getByUserAndFriendId);

/**
 * @swagger
 * /conversations:
 *   post:
 *     summary: Tạo một cuộc trò chuyện mới
 *     tags: [Conversations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participants
 *             properties:
 *               creatorId:
 *                 type: string
 *                 description: Id người tạo
 *                 example: "67cd4b33637423adf651fc96"
 *               participants:
 *                 type: array
 *                 description: Danh sách ID người tham gia
 *                 items:
 *                   type: string
 *                   example: "67cd4b33637423adf651fc96"
 *               groupName:
 *                 type: string
 *                 description: Tên nhóm (bắt buộc nếu type là 'group')
 *                 example: "Nhóm du lịch"
 *               avtGroup:
 *                 type: string
 *                 description: Ảnh đại diện nhóm (bắt buộc nếu type là 'group')
 *                 example: "https://picsum.photos/200"
 *               pageId:
 *                 type: string
 *                 description: ID của Page (bắt buộc nếu type là 'page')
 *                 example: "67c53c3f653413282ce1528f"
 *               lastMessage:
 *                 type: object
 *                 description: Tin nhắn cuối cùng trong cuộc trò chuyện
 *                 properties:
 *                   sender:
 *                     type: string
 *                     description: ID người gửi tin nhắn
 *                     example: "67cd4b33637423adf651fc96"
 *                   contentType:
 *                     type: string
 *                     enum: [img, video, text, record]
 *                     description: Loại nội dung tin nhắn
 *                     example: "text"
 *                   message:
 *                     type: string
 *                     description: Nội dung tin nhắn (nếu có)
 *                     example: "Xin chào"
 *                   mediaUrl:
 *                     type: string
 *                     description: URL của media (nếu có)
 *                     example: "https://picsum.photos/200"
 *     responses:
 *       201:
 *         description: Cuộc trò chuyện được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.post('/', ConversationController.createConversation);


/**
 * @swagger
 * /conversations/{id}:
 *   patch:
 *     summary: Cập nhật một cuộc trò chuyện theo ID
 *     tags: [Conversations]
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
 *             $ref: '#/components/schemas/Conversation'
 *     responses:
 *       200:
 *         description: Cập nhật thành công cuộc trò chuyện
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
Router.patch('/:id', verifyToken,ConversationController.updateConversationById);

/**
 * @swagger
 * /conversations:
 *   patch:
 *     summary: Cập nhật tất cả cuộc trò chuyện
 *     tags: [Conversations]
 *     responses:
 *       200:
 *         description: Cập nhật thành công tất cả cuộc trò chuyện
 */
Router.patch('/',verifyToken, ConversationController.updateAllConversations);

/**
 * @swagger
 * /conversations/{id}:
 *   delete:
 *     summary: Xóa một cuộc trò chuyện theo ID
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cuộc trò chuyện đã được xóa thành công
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
Router.delete('/:id',verifyToken, ConversationController.deleteConversationById);

/**
 * @swagger
 * /conversations/user/{id}:
 *   get:
 *     summary: Lấy tất cả cuộc trò chuyện theo id người dùng
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về thông tin cuộc trò chuyện
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
Router.get('/user/:id',verifyToken, ConversationController.getConversationFriends);

/**
 * @swagger
 * /conversations/user/{id}/without-friend:
 *   get:
 *     summary: Lấy tất cả cuộc trò chuyện người lạ theo id người dùng
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về thông tin cuộc trò chuyện
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
Router.get('/user/:id/without-friend',verifyToken, ConversationController.getConversationWithoutFriends);

/**
 * @swagger
 * /conversations/user/{id}/new-chat:
 *   get:
 *     summary: Lấy danh sách bạn bè chưa từng nhắn tin
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về thông tin cuộc trò chuyện
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
Router.get('/user/:id/new-chat',verifyToken, ConversationController.getFriendsWithoutPrivateChat);

/**
 * @swagger
 * /conversations/{id}/setting:
 *   patch:
 *     summary: Cập nhật setting một cuộc trò chuyện
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cuộc trò chuyện
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
 *               notifications:
 *                 type: boolean
 *                 description: Bật hoặc tắt thông báo
 *               muteUntil:
 *                 type: number
 *                 nullable: true
 *                 description: Thời gian tắt thông báo (timestamp), null nếu không tắt
 *               active:
 *                 type: boolean
 *                 description: False để kích người dùng
 *               _id:
 *                 type: string
 *                 description: ID của setting cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật thành công cuộc trò chuyện
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 *       500:
 *         description: Lỗi server
 */

Router.patch('/:id/setting',verifyToken, ConversationController.updateUserSetting);

/**
 * @swagger
 * /conversations/sos/{id}:
 *   patch:
 *     summary: Cập nhật trạng thái SOS cho các cuộc trò chuyện của người dùng
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần cập nhật trạng thái SOS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationsId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách ID các cuộc trò chuyện cần đặt SOS thành true
 *             required:
 *               - conversationsId
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái SOS thành công
 *       404:
 *         description: Lỗi khi cập nhật trạng thái SOS
 *       500:
 *         description: Lỗi server
 */
Router.patch('/sos/:id',verifyToken, ConversationController.updateSos);

/**
 * @swagger
 * /conversations/sos/{id}:
 *   get:
 *     summary: Lấy danh sách cuộc trò chuyện có trạng thái SOS của người dùng
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng để lấy danh sách cuộc trò chuyện có SOS
 *     responses:
 *       200:
 *         description: Lấy danh sách cuộc trò chuyện SOS thành công
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện SOS
 *       500:
 *         description: Lỗi server
 */
Router.get('/sos/:id',verifyToken, ConversationController.getSosConversations);

/**
 * @swagger
 * /conversations/user/{id}/pages:
 *   get:
 *     summary: Lấy tất cả cuộc trò chuyện với page của người dùng
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về thông tin cuộc trò chuyện
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
Router.get('/user/:id/pages', ConversationController.getConversationOfPages);

Router.patch('/:id/add-member',verifyToken, ConversationController.updateParticipantsAndSettings);

/**
 * @swagger
 * /messages/avt-groups/{id}:
 *   post:
 *     summary: Thay đổi avt nhóm
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
 *               userId:
 *                 type: string
 *                 description: Id người dùng
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Tệp tin đính kèm (chỉ bắt buộc nếu type là 'img')
 *     responses:
 *       201:
 *         description: Tạo tin nhắn thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
Router.patch('/avt-groups/:id',verifyToken, upload.single('file'), ConversationController.changeAvtGroup);

export const conversationdRoute = Router;
