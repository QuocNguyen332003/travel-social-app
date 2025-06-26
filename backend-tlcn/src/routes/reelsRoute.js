import express from 'express';
import { reelsController } from '../controllers/reelsController.js';
import upload from '../config/multerConfig.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Reels
 *   description: API quản lý reels
 */

/**
 * @swagger
 * /reels:
 *   get:
 *     summary: Lấy danh sách reels với phân trang
 *     tags: [Reels]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Số lượng reels mỗi trang
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số lượng reels bỏ qua
 *     responses:
 *       200:
 *         description: Danh sách các reels
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
 *                     $ref: '#/components/schemas/Reel'
 *                 total:
 *                   type: integer
 *                   description: Tổng số reels
 *                 message:
 *                   type: string
 */
Router.get('/',verifyToken, reelsController.getReels);
/**
 * @swagger
 * /reels/{id}:
 *   get:
 *     summary: Lấy thông tin reel theo ID
 *     tags: [Reels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của reel
 *     responses:
 *       200:
 *         description: Thông tin reel
 *       404:
 *         description: Reel không tồn tại
 */
Router.get('/:id',verifyToken, reelsController.getReelById);

/**
 * @swagger
 * /reels:
 *   post:
 *     summary: Tạo một reel mới
 *     tags: [Reels]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               createdBy:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               hashTag:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["#travel", "#food"]
 *               scope:
 *                 type: string
 *                 enum: [Công khai, Riêng tư]
 *                 example: "Công khai"
 *               content:
 *                 type: string
 *                 example: "Đây là nội dung bài viết"
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: File video (chỉ chấp nhận video)
 *     responses:
 *       201:
 *         description: Reel được tạo thành công
 *       400:
 *         description: Lỗi khi tạo reel
 */
Router.post('/',verifyToken, upload.fields([{ name: 'media', maxCount: 1 }]), reelsController.createReel);

/**
 * @swagger
 * /reels/{id}:
 *   put:
 *     summary: Cập nhật reel theo ID
 *     tags: [Reels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của reel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reel'
 *     responses:
 *       200:
 *         description: Reel được cập nhật thành công
 *       404:
 *         description: Reel không tồn tại
 */
Router.put('/:id',verifyToken, reelsController.updateReelById);

/**
 * @swagger
 * /reels:
 *   put:
 *     summary: Cập nhật tất cả reels
 *     tags: [Reels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reel'
 *     responses:
 *       200:
 *         description: Tất cả reels được cập nhật thành công
 */
Router.put('/',verifyToken, reelsController.updateAllReels);

/**
 * @swagger
 * /reels/{id}:
 *   delete:
 *     summary: Xóa reel theo ID
 *     tags: [Reels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của reel
 *     responses:
 *       200:
 *         description: Reel được xóa thành công
 *       404:
 *         description: Reel không tồn tại
 */
Router.delete('/:id',verifyToken, reelsController.deleteReelById);

/**
 * @swagger
 * components:
 *   schemas:
 *     ReelRequest:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: "67d2e8e01a29ef48e08a19f4"
 *       required:
 *         - userId
 *     ReelResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             emoticons:
 *               type: array
 *               items:
 *                 type: string
 *         message:
 *           type: string
 * /reels/{reelId}/toggle-like:
 *   patch:
 *     summary: Thích hoặc bỏ thích một reel
 *     tags: [Reels]
 *     parameters:
 *       - in: path
 *         name: reelId
 *         required: true
 *         schema:
 *           type: string
 *         example: "65d2ebeb2f8fb814b56fa112"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReelRequest'
 *     responses:
 *       200:
 *         description: Thích/bỏ thích reel thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReelResponse'
 *       400:
 *         description: Thiếu userId
 *       500:
 *         description: Lỗi server
 */
Router.patch('/:reelId/toggle-like',verifyToken, reelsController.toggleLike);

/**
 * @swagger
 * /reels/{reelId}/comments:
 *   get:
 *     summary: Lấy danh sách bình luận của reel
 *     tags: [Reels]
 *     parameters:
 *       - in: path
 *         name: reelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của reel
 *     responses:
 *       200:
 *         description: Danh sách bình luận
 */
Router.get('/:reelId/comments',verifyToken, reelsController.getCommentsByReelId);
/**
 * @swagger
 * /reels/{reelId}/total-comments:
 *   get:
 *     summary: Lấy tổng số comment của một reel (bao gồm comment cha và tất cả comment con)
 *     tags: [Reels]
 *     parameters:
 *       - in: path
 *         name: reelId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của reel cần tính tổng comment
 *     responses:
 *       200:
 *         description: Trả về tổng số comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: number
 *                 message:
 *                   type: string
 *       404:
 *         description: Reel không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
Router.get('/:reelId/total-comments', reelsController.getTotalComments);
export const reelsRoute = Router;
