import express from 'express';
import { tripController } from '../controllers/tripController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Trips
 */

/**
 * @swagger
 * /trips:
 *   get:
 *     summary: Lấy danh sách chuyến đi
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Trả về danh sách chuyến đi
 */
Router.get('/',verifyToken, tripController.getTrips);

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Lấy chuyến đi theo ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyến đi cần lấy
 *     responses:
 *       200:
 *         description: Trả về chuyến đi
 */
Router.get('/:id',verifyToken, tripController.getTripById);

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Tạo chuyến đi mới
 *     tags: [Trips]
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
 *       201:
 *         description: Tạo chuyến đi thành công
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
 *                   description: Dữ liệu của chuyến đi mới tạo
 *                 message:
 *                   type: string
 *                   example: "Tạo chuyến đi thành công"
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
Router.post('/',verifyToken, tripController.createTrip);


/**
 * @swagger
 * /trips/{id}:
 *   patch:
 *     summary: Cập nhật chuyến đi theo ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyến đi cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật chuyến đi thành công
 */
Router.patch('/:id',verifyToken, tripController.updateTripById);

/**
 * @swagger
 * /trips:
 *   patch:
 *     summary: Cập nhật tất cả chuyến đi
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả chuyến đi thành công
 */
Router.patch('/',verifyToken, tripController.updateAllTrips);

/**
 * @swagger
 * /trips/{id}:
 *   delete:
 *     summary: Xóa chuyến đi theo ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyến đi cần xóa
 *     responses:
 *       200:
 *         description: Xóa chuyến đi thành công
 */
Router.delete('/:id',verifyToken, tripController.deleteTripById);

/**
 * @swagger
 * /trips/{id}/locations:
 *   post:
 *     summary: Thêm địa điểm mới vào chuyến đi
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyến đi cần thêm địa điểm
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
 *               placeId:
 *                 type: string
 *                 description: ID của địa điểm
 *               latitude:
 *                 type: number
 *                 description: Vĩ độ của địa điểm
 *               longitude:
 *                 type: number
 *                 description: Kinh độ của địa điểm
 *               address:
 *                 type: string
 *                 description: Địa chỉ chi tiết
 *     responses:
 *       200:
 *         description: Thêm địa điểm thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc lỗi nghiệp vụ
 *       500:
 *         description: Lỗi server
 */
Router.post('/:id/locations',verifyToken, tripController.addNewLocation);

/**
 * @swagger
 * /trips/{id}/locations:
 *   delete:
 *     summary: Xóa địa điểm khỏi chuyến đi
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyến đi
 *       - in: query
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm cần xóa khỏi chuyến đi
 *     responses:
 *       200:
 *         description: Xóa địa điểm thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc lỗi nghiệp vụ
 *       500:
 *         description: Lỗi server
 */
Router.delete('/:id/locations',verifyToken, tripController.deleteNewLocation);

/**
 * @swagger
 * /trips/{id}/locations:
 *   patch:
 *     summary: Thay đổi vị trí 2 phần tử trong danh sách địa điểm
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chuyến đi
 *       - in: query
 *         name: locationId1
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm thứ 1
 *       - in: query
 *         name: locationId2
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa điểm thứ 2
 *     responses:
 *       200:
 *         description: Thay đổi địa điểm thành công
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
 *                   example: "Đổi vị trí thành công"
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc lỗi nghiệp vụ
 *       500:
 *         description: Lỗi server
 */
Router.patch('/:id/locations',verifyToken, tripController.changePosition);

export const tripRoute = Router;
