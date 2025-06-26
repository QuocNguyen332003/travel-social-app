import express from 'express';
import { hobbyController } from '../controllers/hobbyController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Hobbies
 */

/**
 * @swagger
 * /hobbies:
 *   get:
 *     summary: Lấy danh sách sở thích
 *     tags: [Hobbies]
 *     responses:
 *       200:
 *         description: Trả về danh sách sở thích
 */
Router.get('/', hobbyController.getHobbies);

/**
 * @swagger
 * /hobbies/{id}:
 *   get:
 *     summary: Lấy sở thích theo ID
 *     tags: [Hobbies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sở thích cần lấy
 *     responses:
 *       200:
 *         description: Trả về sở thích
 */
Router.get('/:id', hobbyController.getHobbyById);

/**
 * @swagger
 * /hobbies:
 *   post:
 *     summary: Tạo sở thích mới
 *     tags: [Hobbies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Chơi cờ vua"
 *     responses:
 *       201:
 *         description: Tạo sở thích thành công
 */
Router.post('/', hobbyController.createHobby);

/**
 * @swagger
 * /hobbies/{id}:
 *   patch:
 *     summary: Cập nhật sở thích theo ID
 *     tags: [Hobbies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sở thích cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật sở thích thành công
 */
Router.patch('/:id', hobbyController.updateHobbyById);

/**
 * @swagger
 * /hobbies:
 *   patch:
 *     summary: Cập nhật tất cả sở thích
 *     tags: [Hobbies]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả sở thích thành công
 */
Router.patch('/', hobbyController.updateAllHobbies);

/**
 * @swagger
 * /hobbies/{id}:
 *   delete:
 *     summary: Xóa sở thích theo ID
 *     tags: [Hobbies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sở thích cần xóa
 *     responses:
 *       200:
 *         description: Xóa sở thích thành công
 */
Router.delete('/:id', hobbyController.deleteHobbyById);

export const hobbyRoute = Router;
