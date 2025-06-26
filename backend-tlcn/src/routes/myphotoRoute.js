import express from 'express';
import upload from '../config/multerConfig.js';
import { myPhotoController } from '../controllers/myPhotoController.js';
import { verifyToken, verifyAdmin } from '../middlewares/verifyToken.js';
const Router = express.Router();
/**
 * @swagger
 * tags:
 *   name: MyPhotos
 */

/**
 * @swagger
 * /myphotos:
 *   get:
 *     summary: Lấy danh sách ảnh/video/ghi âm
 *     tags: [MyPhotos]
 *     parameters:
 *       - in: query
 *         name: idAuthor
 *         schema:
 *           type: string
 *         required: false
 *         description: ID của tác giả
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Loại nội dung (ảnh, video, ghi âm)
 *     responses:
 *       200:
 *         description: Trả về danh sách ảnh/video/ghi âm
 */
Router.get('/', myPhotoController.getMyPhotos);

/**
 * @swagger
 * /myphotos/{id}:
 *   get:
 *     summary: Lấy ảnh/video/ghi âm theo ID
 *     tags: [MyPhotos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ảnh/video/ghi âm cần lấy
 *     responses:
 *       200:
 *         description: Trả về ảnh/video/ghi âm
 */
Router.get('/:id', myPhotoController.getMyPhotoById);

/**
 * @swagger
 * /myphotos/{id}:
 *   patch:
 *     summary: Cập nhật ảnh/video/ghi âm theo ID
 *     tags: [MyPhotos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ảnh/video/ghi âm cần cập nhật
 *     responses:
 *       200:
 *         description: Cập nhật ảnh/video/ghi âm thành công
 */
Router.patch('/:id', myPhotoController.updateMyPhotoById);

/**
 * @swagger
 * /myphotos:
 *   patch:
 *     summary: Cập nhật tất cả ảnh/video/ghi âm
 *     tags: [MyPhotos]
 *     responses:
 *       200:
 *         description: Cập nhật tất cả ảnh/video/ghi âm thành công
 */
Router.patch('/', myPhotoController.updateAllMyPhotos);

/**
 * @swagger
 * /myphotos/{id}:
 *   delete:
 *     summary: Xóa ảnh/video/ghi âm theo ID
 *     tags: [MyPhotos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của ảnh/video/ghi âm cần xóa
 *     responses:
 *       200:
 *         description: Xóa ảnh/video/ghi âm thành công
 */
Router.delete('/:id', myPhotoController.deleteMyPhotoById);

/**
 * @swagger
 * /myphotos:
 *   post:
 *     summary: Upload ảnh/video/ghi âm lên Google Cloud Storage và tạo MyPhoto
 *     tags: [MyPhotos]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               idAuthor:
 *                 type: string
 *                 example: "60f7ebeb2f8fb814b56fa181"
 *               type:
 *                 type: string
 *                 enum: ['img', 'video', 'record']
 *                 example: "img"
 *               folderType:
 *                 type: string
 *                 enum: ['articles', 'users', 'reels']
 *                 example: "articles"
 *               referenceId:
 *                 type: string
 *                 example: "65d2ebeb2f8fb814b56fa112"
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Upload file thành công
 */
Router.post('/', upload.single('file'), myPhotoController.uploadFile);

/**
 * @swagger
 * /myphotos/{id}/user:
 *   get:
 *     summary: Lấy ảnh/video/ghi âm theo id user
 *     tags: [MyPhotos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [img, video, record]
 *         required: false
 *         description: Lọc theo loại nội dung (img, video, record)
 *     responses:
 *       200:
 *         description: Lấy ảnh/video/ghi âm theo id user thành công
 */
Router.get('/:id/user', myPhotoController.getMyPhotosAndUser);


export const myPhotoRoute = Router;
