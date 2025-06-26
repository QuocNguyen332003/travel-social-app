// routes/recommendationRoute.js
import express from 'express';
import { recommendationController } from '../controllers/recommendationController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: API gợi ý bài viết
 */

/**
 * @swagger
 * /recommendations/{userId}:
 *   get:
 *     summary: Lấy danh sách bài viết gợi ý cho người dùng với phân trang
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: userId
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
 *         description: Số bài viết mỗi trang
 *     responses:
 *       200:
 *         description: Trả về danh sách bài viết gợi ý
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     articles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           createdBy:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               displayName:
 *                                 type: string
 *                               avt:
 *                                 type: object
 *                           listPhoto:
 *                             type: array
 *                             items:
 *                               type: object
 *                           groupID:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               groupName:
 *                                 type: string
 *                           address:
 *                             type: object
 *                           scope:
 *                             type: string
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: ID không hợp lệ hoặc tham số phân trang không hợp lệ
 *       500:
 *         description: Lỗi server
 */
Router.get('/:userId', recommendationController.getRecommendations);

export const recommendationRoute = Router;