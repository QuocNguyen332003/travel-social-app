import express from 'express';
import { ticketController } from '../controllers/ticketController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Lấy danh sách vé
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Trả về danh sách vé
 */
Router.get('/',verifyToken, ticketController.getTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Lấy vé theo ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vé cần lấy
 *     responses:
 *       200:
 *         description: Trả về vé
 */
Router.get('/:id',verifyToken, ticketController.getTicketById);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Tạo một vé mới và cập nhật listTicket trong Page
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - pageId
 *             properties:
 *               name:
 *                 type: string
 *                 description: "Tên của vé"
 *                 example: "Vé 01"
 *               price:
 *                 type: number
 *                 description: "Giá của vé (đơn vị: đồng)"
 *                 example: 10000
 *               description:
 *                 type: string
 *                 description: "Mô tả của vé (không bắt buộc)"
 *                 example: "Vé vào cổng chính"
 *               pageId:
 *                 type: string
 *                 description: "ID của Page mà vé thuộc về"
 *                 example: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Vé được tạo thành công và listTicket trong Page đã được cập nhật
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
 *                       description: "ID của vé vừa tạo"
 *                       example: "507f1f77bcf86cd799439012"
 *                     name:
 *                       type: string
 *                       example: "Vé 01"
 *                     price:
 *                       type: number
 *                       example: 10000
 *                     description:
 *                       type: string
 *                       example: "Vé vào cổng chính"
 *                     pageId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                 message:
 *                   type: string
 *                   example: "Tạo vé thành công"
 *       400:
 *         description: Yêu cầu không hợp lệ (thiếu pageId hoặc dữ liệu không đúng)
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
 *                   example: "pageId is required to create a ticket"
 *       404:
 *         description: Không tìm thấy Page với pageId cung cấp
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
 *                   example: "Page not found"
 *       500:
 *         description: Lỗi server khi xử lý yêu cầu
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
 *                   example: "Internal server error"
 */
Router.post('/',verifyToken, ticketController.createTicket);

/**
 * @swagger
 * /tickets/{id}:
 *   patch:
 *     summary: Cập nhật vé theo ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vé cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật vé thành công
 */
Router.patch('/:id',verifyToken, ticketController.updateTicketById);

/**
 * @swagger
 * /tickets:
 *   patch:
 *     summary: Cập nhật tất cả vé
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả vé thành công
 */
Router.patch('/',verifyToken, ticketController.updateAllTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Xóa vé theo ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vé cần xóa
 *     responses:
 *       200:
 *         description: Xóa vé thành công
 */
Router.delete('/:id',verifyToken, ticketController.deleteTicketById);

export const ticketRoute = Router;
