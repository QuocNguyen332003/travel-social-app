import { reportService } from "../services/reportService.js";
import { articleService } from "../services/articleService.js";

const getReports = async (req, res) => {
  try {
    const reports = await reportService.getReports();
    res.status(200).json({ success: true, data: reports, message: 'Lấy danh sách báo cáo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const report = await reportService.getReportById(req.params.id);
    if (!report) return res.status(404).json({ success: false, data: null, message: 'Báo cáo không tồn tại' });
    res.status(200).json({ success: true, data: report, message: 'Lấy báo cáo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const createReport = async (req, res) => {
  try {
    const { _idReporter, reason, articleId } = req.body;

    if (!articleId) {
      return res.status(400).json({ success: false, message: "Thiếu ID bài viết" });
    }
    const newReport = await reportService.createReport({ _idReporter, reason });

    await articleService.updateArticleById(articleId, { $push: { reports: newReport._id } });

    res.status(201).json({
      success: true,
      data: newReport,
      message: "Tạo báo cáo thành công và cập nhật vào bài viết",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateReportById = async (req, res) => {
  try {
    const updatedReport = await reportService.updateReportById(req.params.id, req.body);
    if (!updatedReport) return res.status(404).json({ success: false, data: null, message: 'Báo cáo không tồn tại' });
    res.status(200).json({ success: true, data: updatedReport, message: 'Cập nhật báo cáo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const updateAllReports = async (req, res) => {
  try {
    const updatedReports = await reportService.updateAllReports(req.body);
    res.status(200).json({ success: true, data: updatedReports, message: 'Cập nhật tất cả báo cáo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteReportById = async (req, res) => {
  try {
    const deletedReport = await reportService.deleteReportById(req.params.id);
    if (!deletedReport) return res.status(404).json({ success: false, data: null, message: 'Báo cáo không tồn tại' });
    res.status(200).json({ success: true, data: null, message: 'Xóa báo cáo thành công' });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

export const reportController = {
  getReports,
  getReportById,
  createReport,
  updateReportById,
  updateAllReports,
  deleteReportById,
};
