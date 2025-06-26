import express from 'express';
import SuggestTouristController from '../AI-algorithms/suggested-tourist-spots/index.js';
import RouteSuggestions from '../AI-algorithms/route-suggestions/index.js';
import upload from '../config/multerConfig.js';
import { ChatbotController } from '../AI-algorithms/route-suggestions/services/ChatbotController.js';
import generateContent from '../AI-algorithms/generate-content-article/generateContent.js';
const Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI
 */

/**
 * @swagger
 * /ai/suggested-page-CF/{id}:
 *   get:
 *     summary: Lấy danh sách địa điểm gợi ý CF
 *     tags: [AI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *           example: "67d2e85d1a29ef48e08a19ef"
 *     responses:
 *       200:
 *         description: Trả về danh sách địa điểm gợi ý
 */
Router.get('/suggested-page-CF/:id', SuggestTouristController.suggestedPageCF);

/**
 * @swagger
 * /ai/suggested-page-CB/{id}:
 *   get:
 *     summary: Lấy danh sách địa điểm gợi ý CB
 *     tags: [AI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *           example: "67d2e85d1a29ef48e08a19ef"
 *     responses:
 *       200:
 *         description: Trả về danh sách địa điểm gợi ý
 */
Router.get('/suggested-page-CB/:id', SuggestTouristController.suggestedPageCB);

/**
 * @swagger
 * /ai/suggested-page-month/{id}:
 *   get:
 *     summary: Lấy danh sách địa điểm gợi ý
 *     tags: [AI]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *           example: "67d2e85d1a29ef48e08a19ef"
 *       - in: query
 *         name: month
 *         required: false
 *         description: Tháng muốn gợi ý địa điểm (1-12)
 *         schema:
 *           type: integer
 *           example: 5
 *     query:
 *     responses:
 *       200:
 *         description: Trả về danh sách địa điểm gợi ý
 */
Router.get('/suggested-page-month/:id', SuggestTouristController.suggestedPageMonth);

/**
 * @swagger
 * /ai/route-suggestions:
 *   post:
 *     summary: Lấy danh sách địa điểm gợi ý
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *                 description: ID của chuyến đi
 *                 example: "67ef738bb891eb4eb9c060e9"
 *               startDateTime:
 *                 type: string
 *                 format: date-time
 *                 description: Thời gian khởi hành (ISO 8601)
 *               useDistance:
 *                 type: boolean
 *                 description: Sử dụng gợi ý theo khoảng cách
 *               useDuration:
 *                 type: boolean
 *                 description: Sử dụng gợi ý theo thời gian
 *               visitingTime:
 *                 type: object
 *                 description: Thời gian tham quan tại từng điểm theo index trong danh sách điểm (tính bằng phút). Index bắt đầu từ 0.
 *                 additionalProperties:
 *                      type: integer
 *                      description: Số phút tham quan tại điểm đó
 *                 example:
 *                      1: 45
 *                      2: 30
 *                      3: 60
 *     responses:
 *       200:
 *         description: Trả về danh sách địa điểm gợi ý
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderedLocations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       displayName:
 *                         type: string
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *                       address:
 *                         type: string
 *                       idealVisitTime:
 *                         type: object
 *                         properties:
 *                           startHour:
 *                             type: integer
 *                           endHour:
 *                             type: integer
 *                 arrivalTimes:
 *                   type: array
 *                   items:
 *                     type: string
 *                 totalDurationInMinutes:
 *                   type: integer
 */

Router.post('/route-suggestions', RouteSuggestions.routeSuggested);

/**
 * @swagger
 * /ai/chatbot:
 *   post:
 *     summary: Trả lời câu hỏi của người dùng thông qua chatbot
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: Câu hỏi của người dùng
 *                 example: "Điểm du lịch nào đẹp ở Đà Lạt?"
 *     responses:
 *       200:
 *         description: Trả về câu trả lời từ chatbot
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
 *                     answer:
 *                       type: string
 *                       description: Câu trả lời từ chatbot
 *                 message:
 *                   type: string
 *       400:
 *         description: Câu hỏi không hợp lệ
 *       500:
 *         description: Lỗi server
 */
Router.post('/chatbot', ChatbotController.getChatbot);

/**
 * @swagger
 * /ai/generate-content:
 *   post:
 *     summary: Sinh nội dung bài viết du lịch dựa trên tối đa 5 file ảnh
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Tối đa 5 file ảnh để phân tích và sinh nội dung
 *                 maxItems: 5
 *     responses:
 *       200:
 *         description: Trả về danh sách tag và nội dung bài viết được sinh ra
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Trạng thái thành công
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     imageTags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           tag:
 *                             type: string
 *                             description: Tên tag
 *                             example: "Beach"
 *                           weight:
 *                             type: number
 *                             description: Trọng số của tag
 *                             example: 0.95
 *                     generatedContent:
 *                       type: string
 *                       description: Nội dung bài viết được sinh ra
 *                       example: "Bãi biển trải dài với cát trắng mịn, hòa quyện cùng màu xanh lam của đại dương..."
 *                 message:
 *                   type: string
 *                   description: Thông báo trạng thái
 *                   example: null
 *       400:
 *         description: Chưa cung cấp file ảnh hoặc số lượng ảnh không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Vui lòng cung cấp 1-5 file ảnh!"
 *       500:
 *         description: Lỗi server hoặc thiếu API key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Đã xảy ra lỗi khi xử lý."
 *                 error:
 *                   type: string
 *                   example: "Lỗi chi tiết từ server"
 */
Router.post('/generate-content', upload.fields([{ name: 'images', maxCount: 5 }]), generateContent);
export const AIRoute = Router;