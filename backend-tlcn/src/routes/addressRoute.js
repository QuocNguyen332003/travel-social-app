import express from 'express';
import { addressController } from '../controllers/addressController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';

const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Addresses
 */

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Lấy danh sách địa chỉ
 *     tags: [Addresses]
 *     responses:
 *       200:
 *         description: Trả về danh sách địa chỉ
 */
Router.get('/',verifyToken, addressController.getAddresses);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: Lấy địa chỉ theo ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa chỉ cần lấy
 *     responses:
 *       200:
 *         description: Trả về địa chỉ
 */
Router.get('/:id',verifyToken, addressController.getAddressById);

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Tạo địa chỉ mới
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               province:
 *                 type: string
 *                 example: "Hà Nội"
 *               district:
 *                 type: string
 *                 example: "Hoàn Kiếm"
 *               ward:
 *                 type: string
 *                 example: "Phường 1"
 *               street:
 *                 type: string
 *                 example: "Nguyễn Du"
 *               placeName:
 *                 type: string
 *                 example: "Hà Nội Tower"
 *               lat:
 *                 type: number
 *                 example: 21.0285
 *               long:
 *                 type: number
 *                 example: 105.8542
 *     responses:
 *       201:
 *         description: Tạo địa chỉ thành công
 */
Router.post('/',verifyToken, addressController.createAddress);

/**
 * @swagger
 * /addresses/{id}:
 *   patch:
 *     summary: Cập nhật địa chỉ theo ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa chỉ cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật địa chỉ thành công
 */
Router.patch('/:id',verifyToken, addressController.updateAddressById);

/**
 * @swagger
 * /addresses:
 *   patch:
 *     summary: Cập nhật tất cả địa chỉ
 *     tags: [Addresses]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả địa chỉ thành công
 */
Router.patch('/',verifyToken, addressController.updateAllAddresses);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Xóa địa chỉ theo ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa chỉ cần xóa
 *     responses:
 *       200:
 *         description: Xóa địa chỉ thành công
 */
Router.delete('/:id',verifyToken, addressController.deleteAddressById);

export const addressRoute = Router;
