import Province from '../models/Province.js';
import { articleService } from './articleService.js';

const getAll = async () => {
    return await Province.find();
};

const getAllNotPage = async () => {
    const provinces = await Province.find();
    return provinces.map((item) => {
        return {
            _id: item._id,
            name: item.name,
            avt: item.avt
        }
    })
};

const getById = async (id) => {
    return await Province.findById(id);
};

const createProvince = async (data) => {
    return await Province.create(data)
}

const updateProvinceById = async (id, data) => {
    return await Province.findByIdAndUpdate(id, data, { new: true })
}

const updateAllProvinces = async (data) => {
    return await Province.updateMany({}, data, { new: true })
}

const deleteProvinceById = async (id) => {
    return await Province.findByIdAndDelete(id)
}

const addNewPage = async (provinceId, pageId) => {
    const updatedProvince = await Province.findByIdAndUpdate(
        provinceId,
        { $push: { listPage: pageId } },
        { new: true }
    );
    return updatedProvince;
}

const getArticleOfPage = async (provinceId, limit = 5, skip = 0) => {
    try {
        // Lấy province với listPage đã được populate
        const province = await Province.findById(provinceId)
            .populate({
                path: 'listPage',
                select: 'listArticle', // Chỉ lấy field listArticle
            });
        if (!province) {
            return {success: false, message: "Không tìm thấy tỉnh"}
        }

        // Lấy tất cả article IDs từ các page
        const allArticleIds = province.listPage
            .flatMap(page => page.listArticle); // Gộp tất cả mảng listArticle thành 1 mảng

        // Lấy dữ liệu chi tiết của các article với limit và skip
        const articles = await Promise.all(
            allArticleIds.map((item) => articleService.getArticleById(item))
        );

        // Đếm tổng số bài viết (không áp dụng limit/skip)
        const totalArticles = allArticleIds.length;

        return { 
            success: true,
            data: {
                articles,
                total: totalArticles,
                limit,
                skip
            }
        };
    } catch (error) {
        return {success: false, message: "Lỗi đã xảy ra trong quá trình lấy dữ liệu"}
    }
};

const getHotPage = async (provinceId, limit = 10, skip = 0) => {
  const province = await Province.findById(provinceId)
    .populate({
      path: 'listPage',
      populate: {
        path: 'avt',
        model: 'MyPhoto',
        select: 'url'
      }
    });

  let listPage = province.listPage || [];

  // Sắp xếp theo số lượng follower và cắt theo limit/skip
  listPage = listPage
    .sort((a, b) => b.follower.length - a.follower.length)
    .slice(skip, skip + limit);

  return listPage;
}

const getAllPage = async (provinceId, limit = 10, skip = 0) => {
    const province = await Province.findById(provinceId)
    .populate({
      path: 'listPage',
      populate: {
        path: 'avt',
        model: 'MyPhoto',
        select: 'url'
      }
    });

    let listPage = province.listPage;
    listPage = listPage
        .slice(skip, skip + limit);

    return listPage;
}

const provinceService = {
    getAll,
    getById,
    createProvince,
    updateProvinceById,
    updateAllProvinces,
    deleteProvinceById,
    addNewPage,
    getArticleOfPage,
    getHotPage,
    getAllNotPage,
    getAllPage
}

export default provinceService;