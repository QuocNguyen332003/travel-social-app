import express from 'express';
import { commentController } from '../controllers/commentController.js';
import upload from '../config/multerConfig.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Lấy danh sách bình luận
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Trả về danh sách bình luận
 */
Router.get('/',verifyToken, commentController.getComments);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Lấy bình luận theo ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bình luận cần lấy
 *     responses:
 *       200:
 *         description: Trả về bình luận
 */
Router.get('/:id',verifyToken, commentController.getCommentById);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Tạo bình luận mới (hỗ trợ upload ảnh/video)
 *     description: |
 *       - **Bình luận cấp 1** (trên bài viết): Chỉ cần truyền `articleId`
 *       - **Bình luận cấp 2+** (trả lời bình luận khác): Chỉ cần truyền `replyComment`
 *       - Hỗ trợ upload ảnh/video thông qua `media` hoặc `images`
 *     tags: [Comments]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               _iduser:
 *                 type: string
 *                 description: ID của người bình luận
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               content:
 *                 type: string
 *                 description: Nội dung bình luận
 *                 example: "Đây là một bình luận"
 *               articleId:
 *                 type: string
 *                 description: ID của bài viết (chỉ dùng cho bình luận cấp 1)
 *                 example: "65d2ebeb2f8fb814b56fa111"
 *               replyComment:
 *                 type: string
 *                 description: ID của bình luận cha (chỉ dùng khi trả lời bình luận khác)
 *                 example: "65d2ebeb2f8fb814b56fa112"
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Danh sách tệp ảnh hoặc video đính kèm
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Danh sách tệp ảnh đính kèm
 *     responses:
 *       201:
 *         description: Bình luận được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *       400:
 *         description: Thiếu thông tin bắt buộc (`_iduser` hoặc `content`)
 *       404:
 *         description: Bài viết hoặc bình luận cha không tồn tại
 *       500:
 *         description: Lỗi máy chủ khi xử lý yêu cầu
 */
Router.post(
    '/',verifyToken,
    upload.fields([
      { name: 'media', maxCount: 1 }, // Giới hạn 1 file
      { name: 'images', maxCount: 1 }, // Giới hạn 1 file
    ]),
    commentController.createComment
  );

/**
 * @swagger
 * /comments/{id}:
 *   patch:
 *     summary: Cập nhật bình luận theo ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bình luận cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật bình luận thành công
 */
Router.patch('/:id',verifyToken, commentController.updateCommentById);

/**
 * @swagger
 * /comments:
 *   patch:
 *     summary: Cập nhật tất cả bình luận
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả bình luận thành công
 */
Router.patch('/',verifyToken, commentController.updateAllComments);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Xóa bình luận theo ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bình luận cần xóa
 *     responses:
 *       200:
 *         description: Xóa bình luận thành công
 */
Router.delete('/:id',verifyToken, commentController.deleteCommentById);

/**
 * @swagger
 * /comments/{commentId}/like:
 *   patch:
 *     summary: Like hoặc Unlike bình luận
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bình luận cần like/unlike
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID của người dùng thực hiện thao tác
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *     responses:
 *       200:
 *         description: Thao tác like/unlike thành công
 *       400:
 *         description: Thiếu thông tin đầu vào
 *       500:
 *         description: Lỗi máy chủ
 */
Router.patch('/:id/like',verifyToken, commentController.likeComment);


export const commentRoute = Router;
