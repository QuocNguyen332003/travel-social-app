import express from 'express';
import upload from '../config/multerConfig.js';
import { identificationController } from '../controllers/identificationController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Identifications
 */

/**
 * @swagger
 * /identifications:
 *   get:
 *     summary: Lấy danh sách chứng minh thư
 *     tags: [Identifications]
 *     responses:
 *       200:
 *         description: Trả về danh sách chứng minh thư
 */
Router.get('/', identificationController.getIdentifications);

/**
 * @swagger
 * /identifications/{id}:
 *   get:
 *     summary: Lấy chứng minh thư theo ID
 *     tags: [Identifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chứng minh thư cần lấy
 *     responses:
 *       200:
 *         description: Trả về chứng minh thư
 */
Router.get('/:id', identificationController.getIdentificationById);

/**
 * @swagger
 * /identifications:
 *   post:
 *     summary: Tạo chứng minh thư mới từ ảnh CCCD
 *     tags: [Identifications]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cccdImage:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh chứng minh thư (CCCD) để nhận diện thông tin và tạo chứng minh thư
 *     responses:
 *       201:
 *         description: Tạo chứng minh thư thành công từ ảnh
 *       400:
 *         description: Lỗi khi tải lên ảnh hoặc ảnh không hợp lệ
 *       500:
 *         description: Lỗi hệ thống hoặc lỗi không xác định
 */
Router.post('/', upload.single('cccdImage'), identificationController.createIdentification);

/**
 * @swagger
 * /identifications/{id}:
 *   patch:
 *     summary: Cập nhật chứng minh thư theo ID
 *     tags: [Identifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chứng minh thư cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật chứng minh thư thành công
 */
Router.patch('/:id', identificationController.updateIdentificationById);

/**
 * @swagger
 * /identifications:
 *   patch:
 *     summary: Cập nhật tất cả chứng minh thư
 *     tags: [Identifications]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả chứng minh thư thành công
 */
Router.patch('/', identificationController.updateAllIdentifications);

/**
 * @swagger
 * /identifications/{id}:
 *   delete:
 *     summary: Xóa chứng minh thư theo ID
 *     tags: [Identifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chứng minh thư cần xóa
 *     responses:
 *       200:
 *         description: Xóa chứng minh thư thành công
 */
Router.delete('/:id', identificationController.deleteIdentificationById);

/**
 * @swagger
 * /identifications/extract:
 *   post:
 *     summary: Trích xuất dữ liệu từ ảnh CCCD mà không lưu vào cơ sở dữ liệu
 *     tags: [Identifications]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cccdImage:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh chứng minh thư (CCCD) để trích xuất thông tin
 *     responses:
 *       200:
 *         description: Trích xuất dữ liệu CCCD thành công
 *       400:
 *         description: Lỗi khi tải lên ảnh hoặc ảnh không hợp lệ
 *       500:
 *         description: Lỗi hệ thống hoặc lỗi không xác định
 */
Router.post('/extract', upload.single('cccdImage'), identificationController.extractCCCD);
export const identificationRoute = Router;
