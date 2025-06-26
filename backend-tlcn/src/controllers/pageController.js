import { pageService } from '../services/pageService.js';

const getPages = async (req, res) => {
  try {
    const pages = await pageService.getPages();
    res.status(200).json({ success: true, data: pages, message: 'Lấy danh sách Page thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getPageById = async (req, res) => {
  try {
    const page = await pageService.getPageById(req.params.id);
    res.status(200).json({ success: true, data: page, message: 'Lấy Page thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createPage = async (req, res) => {
  try {
    const newPage = await pageService.createPage(req);
    res.status(201).json({ success: true, data: newPage, message: 'Tạo Page thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updatePageById = async (req, res) => {
  try {
    const data = {
      ...req.body,
      avatarFile: req.file || null,
    };

    console.log("Parsed page data:", data);

    const updatedPage = await pageService.updatePageById(req.params.id, data);
    if (!updatedPage) {
      return res.status(404).json({ success: false, data: null, message: "Page không tồn tại" });
    }
    res.status(200).json({ success: true, data: updatedPage, message: "Cập nhật Page thành công" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllPages = async (req, res) => {
  try {
    const updatedPages = await pageService.updateAllPages(req.body);
    res.status(200).json({ success: true, data: updatedPages, message: 'Cập nhật tất cả Pages thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deletePageById = async (req, res) => {
  try {
    const deletedPage = await pageService.deletePageById(req.params.id);
    if (!deletedPage) return res.status(404).json({ success: false, data: null, message: 'Page không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa Page thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

export const pageController = {
  getPages,
  getPageById,
  createPage,
  updatePageById,
  updateAllPages,
  deletePageById,
};
