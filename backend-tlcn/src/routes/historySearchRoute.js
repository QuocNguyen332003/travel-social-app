import express from 'express';
import { historySearchController } from '../controllers/historySearchController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: HistorySearches
 *   description: API quản lý lịch sử tìm kiếm
 */

/**
 * @swagger
 * /historysearches:
 *   get:
 *     summary: Lấy danh sách lịch sử tìm kiếm
 *     tags: [HistorySearches]
 *     responses:
 *       200:
 *         description: Trả về danh sách lịch sử tìm kiếm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HistorySearch'
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách lịch sử tìm kiếm thành công"
 *       500:
 *         description: Lỗi server
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
 *                   example: "Error message"
 */
Router.get('/',verifyToken, historySearchController.getHistorySearches);

/**
 * @swagger
 * /historysearches/{id}:
 *   get:
 *     summary: Lấy lịch sử tìm kiếm theo ID
 *     tags: [HistorySearches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bản ghi lịch sử tìm kiếm cần lấy
 *     responses:
 *       200:
 *         description: Trả về lịch sử tìm kiếm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/HistorySearch'
 *                 message:
 *                   type: string
 *                   example: "Lấy lịch sử tìm kiếm thành công"
 *       404:
 *         description: Lịch sử tìm kiếm không tồn tại
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
 *                   example: "Lịch sử tìm kiếm không tồn tại"
 *       500:
 *         description: Lỗi server
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
 *                   example: "Error message"
 */
Router.get('/:id',verifyToken, historySearchController.getHistorySearchById);

/**
 * @swagger
 * /historysearches/{id}:
 *   patch:
 *     summary: Cập nhật lịch sử tìm kiếm theo ID
 *     tags: [HistorySearches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bản ghi lịch sử tìm kiếm cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keySearch:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Updated search term"]
 *               data:
 *                 type: string
 *                 example: "Updated info"
 *     responses:
 *       200:
 *         description: Cập nhật lịch sử tìm kiếm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/HistorySearch'
 *                 message:
 *                   type: string
 *                   example: "Cập nhật lịch sử tìm kiếm thành công"
 *       404:
 *         description: Lịch sử tìm kiếm không tồn tại
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
 *                   example: "Lịch sử tìm kiếm không tồn tại"
 *       500:
 *         description: Lỗi server
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
 *                   example: "Error message"
 */
Router.patch('/:id',verifyToken, historySearchController.updateHistorySearchById);

/**
 * @swagger
 * /historysearches:
 *   patch:
 *     summary: Cập nhật tất cả lịch sử tìm kiếm
 *     tags: [HistorySearches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 example: "Updated data for all"
 *     responses:
 *       200:
 *         description: Cập nhật tất cả lịch sử tìm kiếm thành công
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
 *                   example: {}
 *                 message:
 *                   type: string
 *                   example: "Cập nhật tất cả lịch sử tìm kiếm thành công"
 *       500:
 *         description: Lỗi server
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
 *                   example: "Error message"
 */
Router.patch('/',verifyToken, historySearchController.updateAllHistorySearches);

/**
 * @swagger
 * /historysearches/{id}:
 *   delete:
 *     summary: Xóa mềm lịch sử tìm kiếm theo ID
 *     tags: [HistorySearches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bản ghi lịch sử tìm kiếm cần xóa
 *     responses:
 *       200:
 *         description: Xóa lịch sử tìm kiếm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Xóa lịch sử tìm kiếm thành công"
 *       404:
 *         description: Lịch sử tìm kiếm không tồn tại
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
 *                   example: "Lịch sử tìm kiếm không tồn tại"
 *       500:
 *         description: Lỗi server
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
 *                   example: "Error message"
 */
Router.delete('/:id',verifyToken, historySearchController.deleteHistorySearchById);

/**
 * @swagger
 * /historysearches:
 *   post:
 *     summary: Thêm hoặc cập nhật lịch sử tìm kiếm theo idUser
 *     tags: [HistorySearches]
 *     description: Nếu idUser tồn tại, thêm keySearch vào bản ghi hiện tại. Nếu không, tạo mới bản ghi lịch sử tìm kiếm.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: string
 *                 description: ID của người dùng
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               keySearch:
 *                 type: string
 *                 description: Từ khóa tìm kiếm cần thêm
 *                 example: "Pham minh quan"
 *             required:
 *               - idUser
 *               - keySearch
 *     responses:
 *       200:
 *         description: Thêm hoặc tạo mới lịch sử tìm kiếm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/HistorySearch'
 *                 message:
 *                   type: string
 *                   example: "Thêm lịch sử tìm kiếm vào bản ghi hiện tại thành công"
 *       400:
 *         description: Thiếu dữ liệu bắt buộc
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
 *                   example: "idUser and keySearch are required"
 *       500:
 *         description: Lỗi server
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
 *                   example: "Error message"
 */
Router.post('/',verifyToken, historySearchController.addHistorySearch);
/**
 * @swagger
 * /historysearches/user/{idUser}:
 *   get:
 *     summary: Lấy lịch sử tìm kiếm theo idUser
 *     tags: [HistorySearches]
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng để lấy lịch sử tìm kiếm
 *     responses:
 *       200:
 *         description: Trả về lịch sử tìm kiếm của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/HistorySearch'
 *                 message:
 *                   type: string
 *                   example: "Lấy lịch sử tìm kiếm theo idUser thành công"
 *       404:
 *         description: Không tìm thấy lịch sử tìm kiếm
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
 *                   example: "Không tìm thấy lịch sử tìm kiếm cho người dùng này"
 *       500:
 *         description: Lỗi server
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
 *                   example: "Error message"
 */
Router.get('/user/:idUser',verifyToken, historySearchController.getHistorySearchByIdUser);
/**
 * @swagger
 * /historysearches/user/{idUser}:
 *   patch:
 *     summary: Cập nhật lịch sử tìm kiếm theo idUser
 *     tags: [HistorySearches]
 *     description: Cập nhật toàn bộ danh sách keySearch cho người dùng theo idUser. Nếu bản ghi không tồn tại, tạo mới.
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng để cập nhật lịch sử tìm kiếm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keySearch:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách từ khóa tìm kiếm mới
 *                 example: ["search1", "search2"]
 *             required:
 *               - keySearch
 *     responses:
 *       200:
 *         description: Cập nhật lịch sử tìm kiếm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/HistorySearch'
 *                 message:
 *                   type: string
 *                   example: "Cập nhật lịch sử tìm kiếm theo idUser thành công"
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
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
 *                   example: "keySearch must be an array"
 *       500:
 *         description: Lỗi server
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
 *                   example: "Error message"
 */
Router.patch('/user/:idUser',verifyToken, historySearchController.updateHistorySearchByIdUser);
export const historySearchRoute = Router;