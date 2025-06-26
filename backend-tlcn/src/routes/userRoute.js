import express from 'express';
import { userController } from '../controllers/userController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Trả về danh sách người dùng
 */
Router.get('/', userController.getUsers);
/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Tìm kiếm người dùng theo displayName với phân trang
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: displayName
 *         schema:
 *           type: string
 *         required: true
 *         description: Tên hiển thị của người dùng để tìm kiếm (không phân biệt dấu)
 *         example: "Nguyen"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng người dùng mỗi trang
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số lượng bản ghi bỏ qua (dùng cho phân trang)
 *     responses:
 *       200:
 *         description: Lấy danh sách người dùng thành công
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
 *                       _id:
 *                         type: string
 *                       displayName:
 *                         type: string
 *                       avt:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           idAuthor:
 *                             type: string
 *                           type:
 *                             type: string
 *                           url:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                           updatedAt:
 *                             type: string
 *                       aboutMe:
 *                         type: string
 *                       friends:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             displayName:
 *                               type: string
 *                             avt:
 *                               type: string
 *                             aboutMe:
 *                               type: string
 *                 total:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Thiếu displayName trong query
 *       500:
 *         description: Lỗi server
 */
Router.get('/search', userController.getUsersByDisplayName);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy người dùng theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần lấy
 *     responses:
 *       200:
 *         description: Trả về người dùng
 */
Router.get('/:id',verifyToken, userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               account:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               identification:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa182"
 *               address:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa183"
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công
 */
Router.post('/',verifyToken, userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Cập nhật người dùng theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật người dùng thành công
 */
Router.patch('/:id',verifyToken, userController.updateUserById);

/**
 * @swagger
 * /users:
 *   patch:
 *     summary: Cập nhật tất cả người dùng
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả người dùng thành công
 */
Router.patch('/',verifyToken, userController.updateAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa người dùng theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần xóa
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 */
Router.delete('/:id', userController.deleteUserById);

/**
 * @swagger
 * /users/{id}/saved-groups:
 *   get:
 *     summary: Lấy danh sách nhóm mà người dùng đã lưu
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
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
 *         description: Số lượng nhóm mỗi trang
 *     responses:
 *       200:
 *         description: Trả về danh sách nhóm đã lưu
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
 *                     $ref: '#/components/schemas/Group'
 *                 total:
 *                   type: integer
 *                   description: Tổng số nhóm
 *                 page:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *       404:
 *         description: Người dùng không tồn tại hoặc chưa lưu nhóm nào
 *       500:
 *         description: Lỗi server
 */
Router.get("/:id/saved-groups",verifyToken, userController.getSavedGroups);

/**
 * @swagger
 * /users/{id}/my-groups:
 *   get:
 *     summary: Lấy danh sách nhóm mà người dùng đã tạo
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
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
 *           default: 10
 *         description: Số lượng nhóm mỗi trang
 *     responses:
 *       200:
 *         description: Trả về danh sách nhóm đã tạo
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
 *                     $ref: '#/components/schemas/Group'
 *                 total:
 *                   type: integer
 *                   description: Tổng số nhóm
 *                 page:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *       404:
 *         description: Người dùng không tồn tại hoặc chưa tạo nhóm nào
 *       500:
 *         description: Lỗi server
 */
Router.get("/:id/my-groups",verifyToken, userController.getMyGroups);

/**
 * @swagger
 * /users/{id}/not-joined-groups:
 *   get:
 *     summary: Lấy danh sách nhóm mà người dùng chưa tham gia
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
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
 *         description: Số lượng nhóm mỗi trang
 *     responses:
 *       200:
 *         description: Trả về danh sách nhóm chưa tham gia
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                 total:
 *                   type: integer
 *                   description: Tổng số nhóm
 *                 page:
 *                   type: integer
 *                   description: Trang hiện tại
 *                 totalPages:
 *                   type: integer
 *                   description: Tổng số trang
 *       404:
 *         description: Người dùng không tồn tại hoặc không có nhóm phù hợp
 *       500:
 *         description: Lỗi server
 */
Router.get("/:id/not-joined-groups",verifyToken, userController.getNotJoinedGroups);

/**
 * @swagger
 * /users/{id}/group-articles:
 *   get:
 *     summary: Lấy tất cả bài viết đã duyệt từ các nhóm mà người dùng tham gia
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
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
 *           default: 10
 *         description: Số lượng bài viết mỗi trang
 *     responses:
 *       200:
 *         description: Trả về danh sách các bài viết đã duyệt
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
 *         description: Người dùng không tồn tại hoặc không có bài viết nào
 *       500:
 *         description: Lỗi server
 */
Router.get("/:id/group-articles",verifyToken, userController.getArticleAllGroups);

/**
 * @swagger
 * /users/{id}/avt:
 *   get:
 *     summary: Lấy ảnh đại diện
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [img, video, record]
 *         required: false
 *         description: Lọc theo loại nội dung (img, video, record)
 *     responses:
 *       200:
 *         description: Lấy ảnh đại diện
 */
Router.get('/:id/avt',verifyToken, userController.getPhotoAvt);

/**
 * @swagger
 * /users/addHobbyByEmail:
 *   post:
 *     summary: Thêm sở thích vào user bằng email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của user
 *                 example: "user@example.com"
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách sở thích
 *                 example: ["Bóng đá", "Nấu ăn"]
 *     responses:
 *       200:
 *         description: Thêm sở thích thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc sở thích đã tồn tại
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
Router.post("/addHobbyByEmail", userController.addHobbyByEmail);
/**
 * @swagger
 * /users/collections:
 *   post:
 *     summary: Tạo collection mới cho user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               name:
 *                 type: string
 *                 example: "Bộ sưu tập ảnh"
 *               type:
 *                 type: string
 *                 enum: ["article", "reels"]
 *                 example: "article"
 *     responses:
 *       200:
 *         description: Tạo collection cho user thành công
 */
Router.post('/collections',verifyToken, userController.createCollection);

/**
 * @swagger
 * /users/{id}/collections:
 *   delete:
 *     summary: Xóa bộ sưu tập của người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7ebeb2f8fb814b56fa181"
 *         description: ID của người dùng
 *       - in: query
 *         name: collectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bộ sưu tập cần xóa
 *     responses:
 *       200:
 *         description: Xóa bộ sưu tập thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi xóa bộ sưu tập
 */
Router.delete('/:id/collections',verifyToken, userController.deleteCollection);

/**
 * @swagger
 * /users/{id}/collections-recent:
 *   get:
 *     summary: Lấy danh sách bài viết gần đây
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7ebeb2f8fb814b56fa181"
 *         description: ID của người dùng
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *         description: Số lượng cần lấy
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi xóa bộ sưu tập
 */
Router.get('/:id/collections-recent',verifyToken, userController.getEarliestItems);

/**
 * @swagger
 * /users/{id}/collections:
 *   get:
 *     summary: Lấy danh sách tất cả bộ sưu tập
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7ebeb2f8fb814b56fa181"
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi xóa bộ sưu tập
 */
Router.get('/:id/collections',verifyToken, userController.getAllCollection);

/**
 * @swagger
 * /users/{id}/friends:
 *   get:
 *     summary: Lấy danh sách bạn bè
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7ebeb2f8fb814b56fa181"
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi xóa bộ sưu tập
 */
Router.get('/:id/friends',verifyToken, userController.getAllFriends);

/**
 * @swagger
 * /users/{id}/setting:
 *   patch:
 *     summary: Cập nhật setting của người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần cập nhật setting
 *     responses:
 *       200:
 *         description: Cập nhật setting thành công
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
 *                   example: { "profileVisibility": true, "allowMessagesFromStrangers": false }
 *                 message:
 *                   type: string
 *                   example: "Cập nhật setting thành công"
 *       400:
 *         description: ID không hợp lệ hoặc dữ liệu setting không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
Router.patch('/:id/setting',verifyToken, userController.updateUserSetting);
/**
 * @swagger
 * /users/{id}/unfriend:
 *   patch:
 *     summary: Hủy kết bạn
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7ebeb2f8fb814b56fa181"
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               friendId:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server khi xóa bộ sưu tập
 */
Router.patch('/:id/unfriend',verifyToken, userController.unFriends);

/**
 * @swagger
 * /users/{id}/suggest:
 *   get:
 *     summary: Lấy danh sách gợi ý bạn bè
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60f7ebeb2f8fb814b56fa181"
 *         description: ID của người dùng
 *       - in: query
 *         name: skip
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số lượng phần tử cần bỏ qua (dùng cho phân trang)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng phần tử tối đa cần lấy
 *     responses:
 *       200:
 *         description: Lấy thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
Router.get('/:id/suggest', userController.suggestedFriends);


/**
 * @swagger
 * /users/{id}/created-pages:
 *   get:
 *     summary: Lấy danh sách các Page do người dùng tạo
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng Page tối đa trả về trên mỗi trang
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số lượng Page bỏ qua (dùng cho phân trang)
 *     responses:
 *       200:
 *         description: Danh sách các Page do người dùng tạo
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.get('/:id/created-pages',verifyToken, userController.getCreatedPages);

/**
 * @swagger
 * /users/account/{accountId}:
 *   get:
 *     summary: Lấy thông tin người dùng theo Account ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài khoản (Account) liên kết với người dùng
 *     responses:
 *       200:
 *         description: Trả về thông tin người dùng
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
 *                       example: "507f191e810c19729de860ea"
 *                     displayName:
 *                       type: string
 *                       example: "John Doe"
 *                     avt:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "507f191e810c19729de860eb"
 *                           url:
 *                             type: string
 *                             example: "https://example.com/avatar.jpg"
 *                     aboutMe:
 *                       type: string
 *                       example: "I am a developer"
 *                     account:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                           example: "john@example.com"
 *                         phone:
 *                           type: string
 *                           example: "1234567890"
 *                         role:
 *                           type: string
 *                           example: "user"
 *                         state:
 *                           type: string
 *                           example: "online"
 *                     friends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "507f191e810c19729de860ec"
 *                           displayName:
 *                             type: string
 *                             example: "Jane Smith"
 *                           avt:
 *                             type: string
 *                             example: "https://example.com/jane.jpg"
 *                           aboutMe:
 *                             type: string
 *                             example: "Jane's bio"
 *                     createdAt:
 *                       type: number
 *                       example: 1698765432100
 *       400:
 *         description: Account ID không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng với Account ID này
 *       500:
 *         description: Lỗi server
 */
Router.get('/account/:accountId', userController.getUserByAccountId);

/**
 * @swagger
 * /users/{id}/add-saved-location:
 *   post:
 *     summary: Thêm địa điểm lưu trên bản đồ
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 description: Tên hiển thị của địa điểm
 *                 example: "Hồ Gươm"
 *               placeId:
 *                 type: string
 *                 description: ID của địa điểm trên Google Maps
 *                 example: "ChIJy3mhDWBdNTERZyOqrwR7wAQ"
 *               latitude:
 *                 type: string
 *                 description: Vĩ độ
 *                 example: "21.0285"
 *               longitude:
 *                 type: string
 *                 description: Kinh độ
 *                 example: "105.8542"
 *               address:
 *                 type: string
 *                 description: Địa chỉ đầy đủ của địa điểm
 *                 example: "Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội"
 *     responses:
 *       200:
 *         description: Địa điểm đã được thêm vào danh sách lưu của user
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi hệ thống
 */
Router.post("/:id/add-saved-location",verifyToken, userController.addSavedLocation);

/**
 * @swagger
 * /users/{id}/delete-saved-location:
 *   delete:
 *     summary: Xóa địa điểm lưu trên bản đồ
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *       - in: query
 *         name: savedId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm cần xóa khỏi danh sách lưu
 *     responses:
 *       200:
 *         description: Địa điểm đã được xóa khỏi danh sách lưu của user
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc không tìm thấy địa điểm
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi hệ thống
 */
Router.delete("/:id/delete-saved-location",verifyToken, userController.deleteSavedLocation);

/**
 * @swagger
 * /users/{id}/saved-locations:
 *   get:
 *     summary: Lấy danh sách địa điểm đã lưu của người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *     responses:
 *       200:
 *         description: Trả về danh sách địa điểm đã lưu
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi hệ thống
 */

Router.get("/:id/saved-locations",verifyToken, userController.getAllSavedLocation);

/**
 * @swagger
 * /users/{id}/check-saved-location:
 *   post:
 *     summary: Kiểm tra xem người dùng đã lưu địa điểm hay chưa
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: object
 *                 properties:
 *                   latitude:
 *                     type: number
 *                     example: 21.0285
 *                   longitude:
 *                     type: number
 *                     example: 105.8542
 *     responses:
 *       200:
 *         description: Trả về kết quả kiểm tra địa điểm đã lưu
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc không tìm thấy người dùng
 *       500:
 *         description: Lỗi hệ thống
 */

Router.post("/:id/check-saved-location",verifyToken, userController.checkSavedLocation);

/**
 * @swagger
 * /users/{id}/trips:
 *   get:
 *     summary: Lấy tất cả chuyến đi của người dùng
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *     responses:
 *       200:
 *         description: Trả về kết quả danh sách chuyến đi
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc không tìm thấy người dùng
 *       500:
 *         description: Lỗi hệ thống
 */

Router.get("/:id/trips",verifyToken, userController.getAllTrip);

/**
 * @swagger
 * /users/{id}/trips:
 *   post:
 *     summary: Tạo chuyến đi mới
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên của chuyến đi
 *               startAddress:
 *                 type: object
 *                 description: Địa điểm bắt đầu
 *                 properties:
 *                   displayName:
 *                     type: string
 *                     description: Tên hiển thị của địa điểm
 *                   placeId:
 *                     type: string
 *                     description: ID của địa điểm
 *                   latitude:
 *                     type: number
 *                     description: Vĩ độ của địa điểm
 *                   longitude:
 *                     type: number
 *                     description: Kinh độ của địa điểm
 *                   address:
 *                     type: string
 *                     description: Địa chỉ chi tiết
 *               endAddress:
 *                 type: object
 *                 description: Địa điểm kết thúc
 *                 properties:
 *                   displayName:
 *                     type: string
 *                     description: Tên hiển thị của địa điểm
 *                   placeId:
 *                     type: string
 *                     description: ID của địa điểm
 *                   latitude:
 *                     type: number
 *                     description: Vĩ độ của địa điểm
 *                   longitude:
 *                     type: number
 *                     description: Kinh độ của địa điểm
 *                   address:
 *                     type: string
 *                     description: Địa chỉ chi tiết
 *     responses:
 *       200:
 *         description: Trả về kết quả chuyến đi mới
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc không tìm thấy người dùng
 *       500:
 *         description: Lỗi hệ thống
 */

Router.post("/:id/trips",verifyToken, userController.createTrip);
/**
 * @swagger
 * /users/{id}/hobbies:
 *   get:
 *     summary: Lấy danh sách sở thích theo User ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Trả về danh sách sở thích của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "507f191e810c19729de860ea"
 *                       name:
 *                         type: string
 *                         example: "Bóng đá"
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách sở thích thành công"
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.get('/:id/hobbies',verifyToken, userController.getHobbiesByUserId);

/**
 * @swagger
 * /users/{id}/hobbies:
 *   patch:
 *     summary: Cập nhật danh sách sở thích theo User ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách sở thích mới
 *                 example: ["Bóng đá", "Nấu ăn", "Du lịch"]
 *     responses:
 *       200:
 *         description: Cập nhật sở thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "507f191e810c19729de860ea"
 *                       name:
 *                         type: string
 *                         example: "Bóng đá"
 *                 message:
 *                   type: string
 *                   example: "Cập nhật sở thích thành công"
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Người dùng không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.patch('/:id/hobbies',verifyToken, userController.updateHobbiesByUserId);
/**
 * @swagger
 * /users/groups/search:
 *   get:
 *     summary: Tìm kiếm nhóm theo groupName với phân trang
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: groupName
 *         schema:
 *           type: string
 *         required: false
 *         description: Tên nhóm để tìm kiếm (không phân biệt dấu)
 *         example: "Study"
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của người dùng để lọc nhóm
 *         example: "507f1f77bcf86cd799439011"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng nhóm mỗi trang
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số lượng bản ghi bỏ qua (dùng cho phân trang)
 *     responses:
 *       200:
 *         description: Lấy danh sách nhóm thành công
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
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       avt:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           idAuthor:
 *                             type: string
 *                           type:
 *                             type: string
 *                           url:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                           updatedAt:
 *                             type: string
 *                       about:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: ['myGroup', 'savedGroup', 'other']
 *                 total:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Thiếu hoặc không hợp lệ userId
 *       500:
 *         description: Lỗi server
 */
Router.get('/groups/search', userController.getGroupByGroupName);

/**
 * @swagger
 * /users/friends-location-articles/{id}:
 *   get:
 *     summary: Lấy danh sách địa chỉ bài viết của bạn bè
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần lấy
 *     responses:
 *       200:
 *         description: Trả về người dùng
 */
Router.get('/friends-location-articles/:id',verifyToken, userController.getFriendLocationArticles);

export const userRoute = Router;
