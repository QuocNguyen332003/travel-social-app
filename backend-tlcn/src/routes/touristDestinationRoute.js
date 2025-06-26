import express from 'express';
import touristDestinationController from '../controllers/touristDestinationController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TouristDestinations
 *   description: API quản lý điểm du lịch
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TouristDestination:
 *       type: object
 *       required:
 *         - name
 *         - province
 *         - best_months
 *         - tags
 *         - coordinates
 *       properties:
 *         name:
 *           type: string
 *           description: Tên điểm du lịch
 *           example: "Bãi Dài Cam Ranh"
 *         province:
 *           type: string
 *           description: Tỉnh thành
 *           example: "Khánh Hòa"
 *         best_months:
 *           type: array
 *           items:
 *             type: number
 *           description: Các tháng đẹp nhất để du lịch
 *           example: [3, 4, 5, 6, 7, 8]
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Các thẻ mô tả đặc điểm điểm du lịch
 *           example: ["beach", "sunset", "marine_life", "cuisine"]
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           description: Tọa độ địa lý [longitude, latitude]
 *           example: [109.2, 11.976]
 */

/**
 * @swagger
 * /tourist-destination:
 *   get:
 *     summary: Lấy danh sách tất cả điểm du lịch
 *     tags: [TouristDestinations]
 *     responses:
 *       200:
 *         description: Danh sách điểm du lịch
 */
Router.get('/',verifyToken, touristDestinationController.getTouristDestinations);

/**
 * @swagger
 * /tourist-destination/{id}:
 *   get:
 *     summary: Lấy thông tin điểm du lịch theo ID
 *     tags: [TouristDestinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của điểm du lịch
 *     responses:
 *       200:
 *         description: Thông tin điểm du lịch
 *       404:
 *         description: Không tìm thấy điểm du lịch
 */
Router.get('/:id',verifyToken, touristDestinationController.getTouristDestinationById);

/**
 * @swagger
 * /tourist-destination:
 *   post:
 *     summary: Tạo mới một điểm du lịch
 *     tags: [TouristDestinations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TouristDestination'
 *     responses:
 *       201:
 *         description: Tạo điểm du lịch thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.post('/',verifyToken, touristDestinationController.createTouristDestination);

/**
 * @swagger
 * /tourist-destination/{id}:
 *   patch:
 *     summary: Cập nhật điểm du lịch theo ID
 *     tags: [TouristDestinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID điểm du lịch cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TouristDestination'
 *     responses:
 *       200:
 *         description: Cập nhật điểm du lịch thành công
 *       404:
 *         description: Không tìm thấy điểm du lịch
 */
Router.patch('/:id',verifyToken, touristDestinationController.updateTouristDestinationById);

/**
 * @swagger
 * /tourist-destination:
 *   patch:
 *     summary: Cập nhật tất cả điểm du lịch
 *     tags: [TouristDestinations]
 *     responses:
 *       200:
 *         description: Cập nhật thành công tất cả điểm du lịch
 */
Router.patch('/',verifyToken, touristDestinationController.updateAllTouristDestinations);

/**
 * @swagger
 * /tourist-destination/{id}:
 *   delete:
 *     summary: Xóa điểm du lịch theo ID
 *     tags: [TouristDestinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của điểm du lịch cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công điểm du lịch
 *       404:
 *         description: Không tìm thấy điểm du lịch
 */
Router.delete('/:id',verifyToken, touristDestinationController.deleteTouristDestinationById);

/**
 * @swagger
 * /tourist-destination/page:
 *   post:
 *     summary: Tạo mới một điểm du lịch từ pageId
 *     tags: [TouristDestinations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageId:
 *                 type: string
 *             required:
 *              - pageId
 *     responses:
 *       200:
 *         description: Tạo điểm du lịch thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */

Router.post('/page',verifyToken, touristDestinationController.createTouristDestinationByPageId);

export const touristDestinationRoute = Router;
