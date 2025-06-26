import express from 'express';
import { accountController } from '../controllers/accountController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Accounts
 */

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Lấy danh sách tài khoản với tùy chọn lọc và phân trang
 *     tags: [Accounts]
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [all, all_active, deleted, online, offline]
 *           default: all_active
 *         description: |
 *           Tiêu chí lọc tài khoản:
 *           - `all`: Lấy tất cả tài khoản (bao gồm cả đã xóa mềm).
 *           - `all_active`: Lấy tất cả tài khoản chưa xóa mềm (_destroy: null, mặc định nếu không cung cấp filter).
 *           - `deleted`: Lấy tài khoản đã xóa mềm (_destroy không null).
 *           - `online`: Lấy tài khoản đang trực tuyến (state: 'online', _destroy: null).
 *           - `offline`: Lấy tài khoản đang ngoại tuyến (state: 'offline', _destroy: null).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Số trang hiện tại (mặc định là 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Số lượng tài khoản trên mỗi trang (mặc định là 10).
 *     responses:
 *       200:
 *         description: Trả về danh sách tài khoản cùng thông tin phân trang
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
 *                         example: "60f7ebeb2f8fb814b56fa181"
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
 *                       phone:
 *                         type: string
 *                         nullable: true
 *                         example: "0123456789"
 *                       role:
 *                         type: string
 *                         example: "user"
 *                       state:
 *                         type: string
 *                         enum: [online, offline]
 *                         example: "online"
 *                       _destroy:
 *                         type: number
 *                         nullable: true
 *                         example: null
 *                       createdAt:
 *                         type: number
 *                         example: 1626857900000
 *                       updatedAt:
 *                         type: number
 *                         example: 1626857900000
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalAccounts:
 *                       type: integer
 *                       example: 48
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách tài khoản thành công"
 *       500:
 *         description: Lỗi máy chủ nội bộ
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
 *                   example: "Lỗi khi lấy danh sách tài khoản"
 */
Router.get('/',verifyToken, accountController.getAccounts);
/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Lấy thông tin tài khoản theo ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài khoản cần lấy
 *     responses:
 *       200:
 *         description: Thông tin tài khoản
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "60f7ebeb2f8fb814b56fa181"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 phone:
 *                   type: string
 *                   example: "0123456789"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       404:
 *         description: Không tìm thấy tài khoản
 */
Router.get('/:id',verifyToken, accountController.getAccountById);

/**
 * @swagger
 * /accounts/{id}:
 *   patch:
 *     summary: Cập nhật một tài khoản theo ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài khoản cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "updateduser@example.com"
 *               phone:
 *                 type: string
 *                 example: "0111222333"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy tài khoản
 */
Router.patch('/:id',verifyToken, accountController.updateAccountById);

/**
 * @swagger
 * /accounts:
 *   patch:
 *     summary: Cập nhật tất cả tài khoản
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               role: "admin"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
Router.patch('/', accountController.updateAllAccounts);

/**
 * @swagger
 * /accounts/{id}:
 *   delete:
 *     summary: Xóa tài khoản theo ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tài khoản cần xóa
 *     responses:
 *       200:
 *         description: Xóa tài khoản thành công
 *       404:
 *         description: Không tìm thấy tài khoản
 */
Router.delete('/:id',verifyToken, accountController.deleteAccountById);
/**
 * @swagger
 * /accounts/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "yourpassword"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token
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
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR..."
 *                     account:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "60f7ebeb2f8fb814b56fa181"
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
 *                         role:
 *                           type: string
 *                           example: "user"
 *       400:
 *         description: Thiếu email hoặc mật khẩu
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
 *                   example: "Vui lòng nhập email và mật khẩu"
 *       401:
 *         description: Email hoặc mật khẩu không đúng, hoặc tài khoản bị xóa
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
 *                   example: "Tài khoản của bạn đã bị xóa do vi phạm tiêu chuẩn cộng đồng"
 */
Router.post('/login', accountController.loginAccount);
/**
 * @swagger
 * /accounts/sendOtp:
 *   post:
 *     summary: Gửi mã OTP đến email hoặc số điện thoại
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 example: "user@example.com hoặc 0123456789"

 *     responses:
 *       200:
 *         description: Mã OTP đã được gửi thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Không tìm thấy email hoặc số điện thoại
 */
Router.post('/sendOtp', accountController.sendOtp);
/**
 * @swagger
 * /accounts/verifyOtp:
 *   post:
 *     summary: Xác minh mã OTP
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 description: Email của người dùng đã nhận OTP
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 description: Mã OTP được gửi qua email
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Xác minh OTP thành công
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
 *                   example: "Xác minh OTP thành công!"
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ hoặc OTP sai
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
 *                   example: "Mã OTP không chính xác."
 *       404:
 *         description: OTP hết hạn hoặc không tồn tại
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
 *                   example: "OTP đã hết hạn hoặc không tồn tại."
 */
Router.post("/verifyOtp", accountController.verifyOtp);
/**
 * @swagger
 * /accounts/updatePassword:
 *   post:
 *     summary: Cập nhật mật khẩu mới
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email của tài khoản cần đổi mật khẩu
 *                 example: "user@example.com"
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới
 *                 example: "newSecurePassword123"
 *     responses:
 *       200:
 *         description: Mật khẩu đã được cập nhật thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Email không tồn tại trong hệ thống
 *       500:
 *         description: Lỗi hệ thống
 */
Router.post("/updatePassword", accountController.updatePassword);
/**
 * @swagger
 * /accounts/create:
 *   post:
 *     summary: Tạo tài khoản mới
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email đăng ký
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: Mật khẩu
 *                 example: "securePassword123"
 *               displayName:
 *                 type: string
 *                 description: Tên hiển thị của người dùng
 *                 example: "John Doe"
 *               hashtag:
 *                 type: string
 *                 description: Hashtag người dùng
 *                 example: "#john123"
 *               number:
 *                 type: string
 *                 description: Số căn cước công dân
 *                 example: "075203018233"
 *               fullName:
 *                 type: string
 *                 description: Họ và tên
 *                 example: "Nguyen Van A"
 *               dateOfBirth:
 *                 type: string
 *                 description: Ngày sinh
 *                 example: "03/03/2000"
 *               sex:
 *                 type: string
 *                 description: Giới tính
 *                 example: "Nam"
 *               nationality:
 *                 type: string
 *                 description: Quốc tịch
 *                 example: "Việt Nam"
 *               placeOfOrigin:
 *                 type: string
 *                 description: Nơi sinh
 *                 example: "Hà Nội"
 *               placeOfResidence:
 *                 type: string
 *                 description: Nơi cư trú
 *                 example: "123 Phố Huế, Hàng Bông, Hoàn Kiếm, Hà Nội"
 *               dateOfExpiry:
 *                 type: string
 *                 description: Ngày hết hạn CCCD
 *                 example: "03/03/2030"
 *               province:
 *                 type: string
 *                 description: Tỉnh/Thành phố
 *                 example: "Hà Nội"
 *               district:
 *                 type: string
 *                 description: Quận/Huyện
 *                 example: "Hoàn Kiếm"
 *               ward:
 *                 type: string
 *                 description: Phường/Xã
 *                 example: "Hàng Bông"
 *               street:
 *                 type: string
 *                 description: Đường/Phố
 *                 example: "123 Phố Huế"
 *               placeName:
 *                 type: string
 *                 description: Tên địa điểm
 *                 example: "Nơi ở"
 *               lat:
 *                 type: number
 *                 description: Vĩ độ
 *                 example: null
 *               long:
 *                 type: number
 *                 description: Kinh độ
 *                 example: null
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
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
 *                   example: "Tạo tài khoản thành công!"
 *                 account:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60f7ebeb2f8fb814b56fa181"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60f7ebeb2f8fb814b56fa182"
 *                     displayName:
 *                       type: string
 *                       example: "John Doe"
 *                     hashtag:
 *                       type: string
 *                       example: "#john123"
 *       400:
 *         description: Email hoặc CCCD đã tồn tại, hoặc dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi hệ thống
 */
Router.post("/create", accountController.createAccount);
/**
 * @swagger
 * /accounts/check-email:
 *   post:
 *     summary: Kiểm tra xem email đã tồn tại trong hệ thống chưa
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email cần kiểm tra
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Kết quả kiểm tra email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 exists:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email khả dụng"
 *       400:
 *         description: Email không hợp lệ hoặc thiếu dữ liệu
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
 *                   example: "Định dạng email không hợp lệ"
 *       500:
 *         description: Lỗi hệ thống
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
 *                   example: "Lỗi server khi kiểm tra email"
 */
Router.post("/check-email", accountController.checkEmail);
/**
 * @swagger
 * /accounts/check-hashtag:
 *   post:
 *     summary: Kiểm tra xem hashtag đã tồn tại trong hệ thống chưa
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hashtag:
 *                 type: string
 *                 description: Hashtag cần kiểm tra
 *                 example: "#john123"
 *     responses:
 *       200:
 *         description: Kết quả kiểm tra hashtag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 exists:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Hashtag khả dụng"
 *       400:
 *         description: Hashtag không hợp lệ hoặc thiếu dữ liệu
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
 *                   example: "Hashtag phải bắt đầu bằng ký tự #"
 *       500:
 *         description: Lỗi hệ thống
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
 *                   example: "Lỗi server khi kiểm tra hashtag"
 */
Router.post("/check-hashtag", accountController.checkHashtag);
/**
 * @swagger
 * /accounts/compare-password:
 *   post:
 *     summary: Kiểm tra tính hợp lệ của mật khẩu
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idAccount:
 *                 type: string
 *                 description: ID của tài khoản
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               password:
 *                 type: string
 *                 description: Mật khẩu cần kiểm tra
 *                 example: "yourpassword"
 *     responses:
 *       200:
 *         description: Mật khẩu hợp lệ
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
 *                   example: "Mật khẩu hợp lệ"
 *       400:
 *         description: Thiếu ID tài khoản hoặc mật khẩu
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
 *                   example: "Vui lòng cung cấp ID tài khoản và mật khẩu"
 *       401:
 *         description: Mật khẩu không đúng
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
 *                   example: "Mật khẩu không đúng"
 *       404:
 *         description: Tài khoản không tồn tại
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
 *                   example: "Tài khoản không tồn tại"
 *       500:
 *         description: Lỗi hệ thống
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
 *                   example: "Lỗi hệ thống, vui lòng thử lại"
 */
Router.post("/compare-password", accountController.comparePassword);

Router.post("/logout",verifyToken, accountController.logOut);

export const accountRoute = Router;
