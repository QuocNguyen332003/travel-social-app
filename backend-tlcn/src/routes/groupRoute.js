import express from 'express';
import { groupController } from '../controllers/groupController.js';
import upload from '../config/multerConfig.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Groups
 */

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Lấy danh sách nhóm
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Trả về danh sách nhóm
 */
Router.get('/',verifyToken, groupController.getGroups);

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     summary: Lấy nhóm theo ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần lấy
 *     responses:
 *       200:
 *         description: Trả về nhóm
 */
Router.get('/:id', groupController.getGroupById);

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Tạo nhóm mới với ảnh đại diện
 *     tags: [Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - groupName
 *               - type
 *               - idCreater
 *             properties:
 *               groupName:
 *                 type: string
 *                 description: Tên của nhóm
 *                 example: "Nhóm học tập"
 *               type:
 *                 type: string
 *                 enum: ['public', 'private']
 *                 description: Loại nhóm (public hoặc private)
 *                 example: "private"
 *               idCreater:
 *                 type: string
 *                 format: ObjectId
 *                 description: ID của người tạo nhóm
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               introduction:
 *                 type: string
 *                 description: Giới thiệu về nhóm
 *                 example: "Nhóm này dành cho những ai yêu thích học tập và nghiên cứu."
 *               avt:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện của nhóm (file ảnh)
 *                 example: "file"
 *               rule:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách các quy tắc của nhóm
 *                 example: ["Không spam", "Không đăng nội dung vi phạm pháp luật"]
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                 description: Danh sách sở thích liên quan đến nhóm
 *                 example: ["60f7ebeb2f8fb814b56fa183", "60f7ebeb2f8fb814b56fa184"]
 *     responses:
 *       201:
 *         description: Nhóm được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Group'
 *                 message:
 *                   type: string
 *                   example: "Tạo nhóm thành công"
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ"
 */
Router.post('/',verifyToken, upload.single('avt'), groupController.createGroup);


/**
 * @swagger
 * /groups/{id}:
 *   patch:
 *     summary: Cập nhật nhóm (chỉ cập nhật trường thay đổi)
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               groupName:
 *                 type: string
 *                 description: Tên mới của nhóm
 *               type:
 *                 type: string
 *                 enum: ['public', 'private']
 *                 description: Loại nhóm
 *               introduction:
 *                 type: string
 *                 description: Giới thiệu về nhóm
 *               avt:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh đại diện mới của nhóm (file ảnh)
 *               rule:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách quy định mới
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                 description: Danh sách sở thích mới
 *     responses:
 *       200:
 *         description: Nhóm được cập nhật thành công
 *       404:
 *         description: Không tìm thấy nhóm
 *       500:
 *         description: Lỗi máy chủ
 */
Router.patch("/:id",verifyToken, upload.single("avt"), groupController.updateGroupById);

/**
 * @swagger
 * /groups:
 *   patch:
 *     summary: Cập nhật tất cả nhóm
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả nhóm thành công
 */
Router.patch('/',verifyToken, groupController.updateAllGroups);

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Xóa nhóm theo ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần xóa
 *     responses:
 *       200:
 *         description: Xóa nhóm thành công
 */
Router.delete('/:id',verifyToken, groupController.deleteGroupById);

/**
 * @swagger
 * /groups/{id}/join:
 *   patch:
 *     summary: Gửi hoặc hủy yêu cầu tham gia nhóm
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần tham gia hoặc hủy yêu cầu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng gửi yêu cầu tham gia hoặc hủy yêu cầu
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *     responses:
 *       200:
 *         description: Xử lý thành công
 *       400:
 *         description: Lỗi dữ liệu hoặc trạng thái không hợp lệ
 *       404:
 *         description: Nhóm không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.patch('/:id/join',verifyToken, groupController.requestJoinOrLeaveGroup);

/**
 * @swagger
 * /groups/{id}/approved-articles:
 *   get:
 *     summary: Lấy tất cả bài viết đã được duyệt trong nhóm
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng bài viết mỗi trang
 *     responses:
 *       200:
 *         description: Trả về danh sách bài viết đã duyệt
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
 *                     $ref: '#/components/schemas/Article'
 *                 total:
 *                   type: integer
 *                   description: Tổng số bài viết
 *                 page:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *       404:
 *         description: Nhóm không tồn tại hoặc không có bài viết đã duyệt
 *       500:
 *         description: Lỗi server
 */
Router.get("/:id/approved-articles",verifyToken, groupController.getApprovedArticles);

/**
 * @swagger
 * /groups/{id}/pending-articles:
 *   get:
 *     summary: Lấy danh sách bài viết đang chờ duyệt trong nhóm
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng bài viết mỗi trang
 *     responses:
 *       200:
 *         description: Trả về danh sách bài viết đang chờ duyệt
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
 *                     $ref: '#/components/schemas/Article'
 *                 total:
 *                   type: integer
 *                   description: Tổng số bài viết
 *                 page:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *       404:
 *         description: Nhóm không tồn tại hoặc không có bài viết chờ duyệt
 *       500:
 *         description: Lỗi server
 */
Router.get('/:id/pending-articles',verifyToken, groupController.getPendingArticles);

/**
 * @swagger
 * /groups/{id}/articles/{articleId}:
 *   patch:
 *     summary: Duyệt hoặc hủy duyệt bài viết trong nhóm
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần duyệt hoặc hủy duyệt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *                 description: Hành động cần thực hiện (approve - duyệt, reject - hủy duyệt)
 *                 example: "approve"
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái bài viết thành công
 *       404:
 *         description: Nhóm hoặc bài viết không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.patch('/:id/articles/:articleId',verifyToken, groupController.updateArticleStatus);

/**
 * @swagger
 * /groups/{id}/rules:
 *   get:
 *     summary: Lấy rule theo ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần lấy
 *     responses:
 *       200:
 *         description: Trả về nhóm
 */
Router.get('/:id/rules',verifyToken, groupController.getRulesById);

/**
 * @swagger
 * /groups/{id}/rules:
 *   patch:
 *     summary: Thêm quy tắc vào nhóm
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần thêm quy tắc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rule
 *             properties:
 *               rule:
 *                 type: string
 *                 description: Quy tắc cần thêm vào nhóm
 *                 example: "Không chia sẻ thông tin cá nhân"
 *     responses:
 *       200:
 *         description: Thêm quy tắc thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Thêm quy tắc thành công"
 *       404:
 *         description: Nhóm không tồn tại
 *       400:
 *         description: Lỗi dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
Router.patch('/:id/rules',verifyToken, groupController.addRuleToGroup);

/**
 * @swagger
 * /groups/{id}/rules/{ruleValue}:
 *   patch:
 *     summary: Xóa một quy tắc khỏi nhóm
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần xóa quy tắc
 *       - in: path
 *         name: ruleValue
 *         required: true
 *         schema:
 *           type: string
 *         description: Giá trị của quy tắc cần xóa
 *     responses:
 *       200:
 *         description: Xóa quy tắc thành công
 *       404:
 *         description: Nhóm hoặc quy tắc không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.patch('/:id/rules/:ruleValue',verifyToken, groupController.deleteRule);

/**
 * @swagger
 * /groups/{groupID}/pending-members:
 *   get:
 *     summary: Lấy danh sách thành viên đang chờ phê duyệt
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID nhóm
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng yêu cầu mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách thành viên chờ duyệt
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       fullName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       joinDate:
 *                         type: string
 *                 total:
 *                   type: integer
 *                   description: Tổng số yêu cầu
 *                 page:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *       404:
 *         description: Nhóm không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.get('/:groupID/pending-members',verifyToken, groupController.getPendingMembers);

/**
 * @swagger
 * /groups/{groupID}/pending-admins:
 *   get:
 *     summary: Lấy danh sách quản trị viên đang chờ phê duyệt
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng quản trị viên mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách quản trị viên chờ duyệt
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       fullName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       inviteDate:
 *                         type: string
 *                 total:
 *                   type: integer
 *                   description: Tổng số quản trị viên chờ duyệt
 *                 page:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *       404:
 *         description: Nhóm không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.get('/:groupID/pending-admins', groupController.getPendingAdmins);

/**
 * @swagger
 * /groups/{groupID}/members:
 *   get:
 *     summary: Lấy danh sách thành viên nhóm (Người tạo, Quản trị viên, Thành viên)
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần lấy danh sách thành viên
 *     responses:
 *       200:
 *         description: Trả về danh sách thành viên nhóm
 *       404:
 *         description: Nhóm không tồn tại
 */
Router.get("/:groupID/members", verifyToken, groupController.getGroupMembers);

 /**
 * @swagger
 * /groups/{groupID}/members/{userID}:
 *   patch:
 *     summary: Cập nhật trạng thái thành viên trong nhóm
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần cập nhật
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thành viên cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 enum: 
 *                   - accepted
 *                   - rejected
 *                   - invite-admin
 *                   - remove-admin
 *                   - accept-admin
 *                 description: Trạng thái cần cập nhật của thành viên
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành viên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Trạng thái thành viên đã được cập nhật"
 *       404:
 *         description: Nhóm hoặc thành viên không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Nhóm hoặc thành viên không tồn tại"
 */
Router.patch("/:groupID/members/:userID", verifyToken, groupController.updateMemberStatus);

/**
 * @swagger
 * /groups/{groupID}/members/{userID}/articles:
 *   get:
 *     summary: Lấy tất cả bài viết đã được duyệt của một thành viên trong nhóm
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thành viên
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng bài viết mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách bài viết đã được duyệt
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
 *                     $ref: '#/components/schemas/Article'
 *                 total:
 *                   type: integer
 *                   description: Tổng số bài viết
 *                 page:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *       404:
 *         description: Nhóm hoặc thành viên không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.get("/:groupID/members/:userID/articles",verifyToken, groupController.getUserApprovedArticles);

/**
 * @swagger
 * /groups/{groupID}/administrators/{administratorsID}:
 *   get:
 *     summary: Kiểm tra xem người dùng có lời mời làm quản trị viên trong nhóm không
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm cần kiểm tra
 *       - in: path
 *         name: administratorsID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần kiểm tra
 *     responses:
 *       200:
 *         description: Người dùng có lời mời làm quản trị viên
 *       404:
 *         description: Không tìm thấy lời mời làm quản trị viên hoặc nhóm không tồn tại
 */
Router.get("/:groupID/administrators/:administratorsID",verifyToken, groupController.checkAdminInvite);

/**
 * @swagger
 * /groups/{groupId}/invite-friends:
 *   get:
 *     summary: Lấy danh sách bạn bè chưa tham gia nhóm
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của nhóm
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng muốn mời bạn bè
 *     responses:
 *       200:
 *         description: Danh sách bạn bè có thể mời vào nhóm
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
Router.get('/:groupId/invite-friends',verifyToken, groupController.getInvitableFriends);

export default Router;







export const groupRoute = Router;
