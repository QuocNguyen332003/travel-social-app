import express from 'express';
import ProvinceController from '../controllers/provinceController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Provinces
 *   description: API quản lý tỉnh/thành phố
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Province:
 *       type: object
 *       required:
 *         - name
 *         - avt
 *       properties:
 *         name:
 *           type: string
 *           description: Tên tỉnh/thành phố
 *           example: "Hà Nội"
 *         avt:
 *           type: string
 *           description: Ảnh đại diện của tỉnh/thành phố (URL)
 *           example: "https://example.com/image.jpg"
 *         listPage:
 *           type: array
 *           description: Danh sách các trang liên quan đến tỉnh/thành phố
 *           items:
 *             type: string
 *           example: ["page1", "page2"]
 */

/**
 * @swagger
 * /province:
 *   get:
 *     summary: Lấy danh sách tất cả các tỉnh/thành phố
 *     tags: [Provinces]
 *     responses:
 *       200:
 *         description: Danh sách các tỉnh/thành phố
 */
Router.get('/',verifyToken, ProvinceController.getProvinces);

/**
 * @swagger
 * /province/not-page:
 *   get:
 *     summary: Lấy danh sách tất cả các tỉnh/thành phố không lấy danh sách trang
 *     tags: [Provinces]
 *     responses:
 *       200:
 *         description: Danh sách các tỉnh/thành phố
 */
Router.get('/not-page',verifyToken, ProvinceController.getAllNotPage);

/**
 * @swagger
 * /province/{id}:
 *   get:
 *     summary: Lấy thông tin một tỉnh/thành phố theo ID
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tỉnh/thành phố cần lấy
 *     responses:
 *       200:
 *         description: Trả về thông tin tỉnh/thành phố
 *       404:
 *         description: Không tìm thấy tỉnh/thành phố
 */
Router.get('/:id',verifyToken, ProvinceController.getProvinceById);

/**
 * @swagger
 * /province:
 *   post:
 *     summary: Tạo một tỉnh/thành phố mới
 *     tags: [Provinces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Province'
 *     responses:
 *       201:
 *         description: Tỉnh/thành phố được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
Router.post('/',verifyToken, ProvinceController.createProvince);

/**
 * @swagger
 * /province/{id}:
 *   patch:
 *     summary: Cập nhật thông tin một tỉnh/thành phố theo ID
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Province'
 *     responses:
 *       200:
 *         description: Cập nhật thành công tỉnh/thành phố
 *       404:
 *         description: Không tìm thấy tỉnh/thành phố
 */
Router.patch('/:id',verifyToken, ProvinceController.updateProvinceById);

/**
 * @swagger
 * /province:
 *   patch:
 *     summary: Cập nhật tất cả tỉnh/thành phố
 *     tags: [Provinces]
 *     responses:
 *       200:
 *         description: Cập nhật thành công tất cả tỉnh/thành phố
 */
Router.patch('/',verifyToken, ProvinceController.updateAllProvinces);

/**
 * @swagger
 * /province/{id}:
 *   delete:
 *     summary: Xóa một tỉnh/thành phố theo ID
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tỉnh/thành phố đã được xóa thành công
 *       404:
 *         description: Không tìm thấy tỉnh/thành phố
 */
Router.delete('/:id',verifyToken, ProvinceController.deleteProvinceById);

/**
 * @swagger
 * /province/{id}/add-page:
 *   patch:
 *     summary: Thêm 1 trang vào tỉnh
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageId:
 *                 type: string
 *                 example: "67d29568980d899657cc410d"
 *     responses:
 *       200:
 *         description: Cập nhật thành công tỉnh/thành phố
 *       404:
 *         description: Không tìm thấy tỉnh/thành phố
 */
Router.patch('/:id/add-page',verifyToken, ProvinceController.addNewPage);

/**
 * @swagger
 * /province/{id}/articles:
 *   get:
 *     summary: Lấy danh sách bài viết trong tỉnh/thành phố
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tỉnh/thành phố
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng bài viết tối đa trả về trên mỗi trang
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số lượng bài viết bỏ qua (dùng cho phân trang)
 *     responses:
 *       200:
 *         description: Danh sách bài viết của tỉnh/thành phố
 *       404:
 *         description: Tỉnh không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.get('/:id/articles',verifyToken, ProvinceController.getArticleOfPage);

/**
 * @swagger
 * /province/{id}/hot-page:
 *   get:
 *     summary: Lấy danh sách trang trong tỉnh/thành phố
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tỉnh/thành phố
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng trang tối đa trả về trên mỗi trang
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số lượng trang bỏ qua (dùng cho phân trang)
 *     responses:
 *       200:
 *         description: Danh sách trang của tỉnh/thành phố
 *       404:
 *         description: Tỉnh không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.get('/:id/hot-page', ProvinceController.getHotPage);

/**
 * @swagger
 * /province/{id}/all-page:
 *   get:
 *     summary: Lấy danh sách trang trong tỉnh/thành phố
 *     tags: [Provinces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của tỉnh/thành phố
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng trang tối đa trả về trên mỗi trang
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số lượng trang bỏ qua (dùng cho phân trang)
 *     responses:
 *       200:
 *         description: Danh sách trang của tỉnh/thành phố
 *       404:
 *         description: Tỉnh không tồn tại
 *       500:
 *         description: Lỗi server
 */
Router.get('/:id/all-page',verifyToken, ProvinceController.getAllPage);

export const provinceRoute = Router;
