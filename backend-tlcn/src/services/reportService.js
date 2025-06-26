import Report from "../models/Report.js";
import Article from "../models/Article.js";
import { articleService } from "./articleService.js";

const getReports = async () => {
  return await Report.find({ _destroy: null })
};

const getReportById = async (id) => {
  return await Report.findOne({ _id: id, _destroy: null })
};

const createReport = async (data) => {
  return await Report.create(data);
};

const updateReportById = async (id, data) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(id, data, { new: true });

    if (!updatedReport) {
      throw new Error('Báo cáo không tồn tại');
    }

    if (data.status === 'accepted') {
      const article = await Article.findOne({ reports: id });
      
      if (article) {
        await articleService.deleteArticleById(article._id);
      } else {
        console.warn(`Không tìm thấy bài viết liên quan đến báo cáo ${id}`);
      }
    }

    return updatedReport;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật báo cáo: ${error.message}`);
  }
};

const updateAllReports = async (data) => {
  return await Report.updateMany({}, data, { new: true });
};

const deleteReportById = async (id) => {
  return await Report.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};

export const reportService = {
  getReports,
  getReportById,
  createReport,
  updateReportById,
  updateAllReports,
  deleteReportById,
};
