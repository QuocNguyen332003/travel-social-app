import express from 'express';
import { pageController } from '../controllers/pageController.js';
import upload from '../config/multerConfig.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

const uploadMiddleware = upload.single('avt');

/**
 * @swagger
 * tags:
 *   name: Pages
 */

/**
 * @swagger
 * /pages:
 *   get:
 *     summary: Lấy danh sách Pages
 *     tags: [Pages]
 *     responses:
 *       200:
 *         description: Trả về danh sách Pages
 */
Router.get('/',verifyToken, pageController.getPages);

/**
 * @swagger
 * /pages/{id}:
 *   get:
 *     summary: Lấy Page theo ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của Page cần lấy
 *     responses:
 *       200:
 *         description: Trả về Page
 */
Router.get('/:id',verifyToken, pageController.getPageById);

/**
 * @swagger
 * /pages:
 *   post:
 *     summary: Tạo Page mới
 *     tags: [Pages]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               idCreater:
 *                 type: string
 *               avt:
 *                 type: string
 *                 format: binary
 *               address:
 *                 type: string
 *                 description: JSON string của thông tin địa chỉ
 *                 example: {   "province": "Đồng Tháp",   "district": "Tam Nông",   "ward": "Tràm Chim",   "street": "",   "placeName": "Vườn Quốc Gia Tràm Chim",   "lat": 10.7069,   "long": 105.5222 }
 *               timeOpen:
 *                 type: string
 *               timeClose:
 *                 type: string
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Tạo Page thành công
 *       400:
 *         description: Thiếu thông tin bắt buộc
 *       500:
 *         description: Lỗi server
 */
Router.post('/',verifyToken, uploadMiddleware, pageController.createPage);

/**
 * @swagger
 * /pages/{id}:
 *   patch:
 *     summary: Cập nhật thông tin của một Page theo ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của Page cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên của trang
 *               address:
 *                 type: string
 *                 description: ID của địa chỉ liên kết với trang
 *               timeOpen:
 *                 type: string
 *                 description: Giờ mở cửa (định dạng HH:mm)
 *               timeClose:
 *                 type: string
 *                 description: Giờ đóng cửa (định dạng HH:mm)
 *               hobbies:
 *                 type: string
 *                 description: Danh sách ID sở thích (JSON string)
 *               avt:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh đại diện của trang
 *               removeAvatar:
 *                 type: string
 *                 description: Cờ để xóa ảnh đại diện (true/false)
 *     responses:
 *       200:
 *         description: Cập nhật Page thành công
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
 *                   description: Dữ liệu Page đã cập nhật
 *                 message:
 *                   type: string
 *                   example: Cập nhật Page thành công
 *       400:
 *         description: Yêu cầu không hợp lệ (lỗi xử lý file hoặc dữ liệu)
 *       404:
 *         description: Không tìm thấy Page với ID đã cung cấp
 *       500:
 *         description: Lỗi server khi xử lý yêu cầu
 */
Router.patch("/:id",verifyToken, upload.single("avt"), pageController.updatePageById);

/**
 * @swagger
 * /pages:
 *   patch:
 *     summary: Cập nhật tất cả Pages
 *     tags: [Pages]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả Pages thành công
 */
Router.patch('/',verifyToken, pageController.updateAllPages);

/**
 * @swagger
 * /pages/{id}:
 *   delete:
 *     summary: Xóa Page theo ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của Page cần xóa
 *     responses:
 *       200:
 *         description: Xóa Page thành công
 */
Router.delete('/:id',verifyToken, pageController.deletePageById);

export const pageRoute = Router;