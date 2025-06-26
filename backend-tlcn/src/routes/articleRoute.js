import express from 'express';
import { articleController } from '../controllers/articleController.js';
import upload from '../config/multerConfig.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';

const Router = express.Router();


/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Lấy danh sách bài viết
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: hashtag
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         style: form
 *         explode: true
 *         description: Mảng các hashtag để lọc bài viết (trả về bài viết có bất kỳ hashtag nào trong mảng)
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *         description: ID người tạo bài viết (lọc theo người tạo)
 *       - in: query
 *         name: groupID
 *         schema:
 *           type: string
 *         description: ID nhóm (lọc theo nhóm)
 *       - in: query
 *         name: isDeleted
 *         schema:
 *           type: boolean
 *         description: Lọc bài viết đã xóa (true) hoặc chưa xóa (false)
 *       - in: query
 *         name: hasReports
 *         schema:
 *           type: boolean
 *         description: Lọc bài viết có báo cáo (true)
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Lọc bài viết theo tỉnh/thành phố
 *       - in: query
 *         name: $limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng bài viết mỗi trang
 *       - in: query
 *         name: $skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số bản ghi cần bỏ qua (dùng cho phân trang)
 *     responses:
 *       200:
 *         description: Trả về danh sách bài viết với thông tin phân trang
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
 *                     $ref: '#/components/schemas/Article'
 *                 total:
 *                   type: integer
 *                   description: Tổng số bài viết
 *                 message:
 *                   type: string
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 */
Router.get('/', articleController.getArticles);

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Lấy bài viết theo ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần lấy
 *     responses:
 *       200:
 *         description: Trả về bài viết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Không tìm thấy bài viết
 */
Router.get('/:id',verifyToken, articleController.getArticleById);

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Tạo bài viết mới (hỗ trợ upload ảnh/video và groupID tùy chọn)
 *     tags: [Articles]
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
 *               content:
 *                 type: string
 *                 example: "Đây là nội dung bài viết"
 *               hashTag:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["#travel", "#food"]
 *               scope:
 *                 type: string
 *                 enum: [Công khai, Riêng tư]
 *                 example: "Công khai"
 *               groupID:
 *                 type: string
 *                 nullable: true
 *                 example: "65d2ebeb2f8fb814b56fa112" # Có thể có hoặc không
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 */
Router.post('/',verifyToken, upload.fields([{ name: 'media', maxCount: 5 }, { name: 'images', maxCount: 5 }]), articleController.createArticle);

/**
 * @swagger
 * /articles/{id}:
 *   patch:
 *     summary: Cập nhật bài viết theo ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Nội dung mới của bài viết"
 *               scope:
 *                 type: string
 *                 example: "private"
 *     responses:
 *       200:
 *         description: Cập nhật bài viết thành công
 *       404:
 *         description: Không tìm thấy bài viết
 */
Router.patch('/:id',verifyToken, articleController.updateArticleById);

/**
 * @swagger
 * /articles:
 *   patch:
 *     summary: Cập nhật tất cả bài viết
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scope:
 *                 type: string
 *                 example: "public"
 *     responses:
 *       200:
 *         description: Cập nhật tất cả bài viết thành công
 */
Router.patch('/',verifyToken, articleController.updateAllArticles);

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Xóa bài viết theo ID (Soft Delete)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần xóa
 *     responses:
 *       200:
 *         description: Xóa bài viết thành công
 *       404:
 *         description: Không tìm thấy bài viết
 */
Router.delete('/:id',verifyToken, articleController.deleteArticleById);

/**
* @swagger
* /articles/{articleId}/like:
*   patch:
*     summary: Like hoặc bỏ like bài viết
*     tags: [Articles]
*     parameters:
*       - in: path
*         name: articleId
*         required: true
*         schema:
*           type: string
*         description: ID bài viết cần like/unlike
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               userId:
*                 type: string
*                 description: ID người dùng thực hiện thao tác like/unlike
*     responses:
*       200:
*         description: Thao tác like/unlike thành công
*       400:
*         description: userId là bắt buộc
*       404:
*         description: Bài viết không tồn tại
 */
Router.patch('/:articleId/like',verifyToken, articleController.toggleLike);

/**
 * @swagger
 * /articles/{articleId}/comments:
 *   get:
 *     summary: Lấy tất cả bình luận của bài viết theo ID bài viết (bao gồm tất cả bình luận con)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần lấy bình luận
 *     responses:
 *       200:
 *         description: Trả về danh sách bình luận của bài viết, bao gồm bình luận con
 */
Router.get("/:articleId/comments",verifyToken, articleController.getCommentsByArticleId);

/**
 * @swagger
 * /articles/provinces/{provinceId}:
 *   get:
 *     summary: Lấy danh sách bài viết theo provinceId
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tỉnh/thành phố để lọc bài viết
 *       - in: query
 *         name: $limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng bài viết mỗi trang
 *       - in: query
 *         name: $skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số bản ghi cần bỏ qua (dùng cho phân trang)
 *     responses:
 *       200:
 *         description: Trả về danh sách bài viết với thông tin phân trang
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
 *                     $ref: '#/components/schemas/Article'
 *                 total:
 *                   type: integer
 *                   description: Tổng số bài viết
 *                 message:
 *                   type: string
 *       404:
 *         description: Không tìm thấy tỉnh/thành phố hoặc không có bài viết
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 */
Router.get('/provinces/:provinceId', articleController.getArticlesByProvinceId);


export const articleRoute = Router;
