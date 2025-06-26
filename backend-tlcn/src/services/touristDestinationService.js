import suggestTouristDataGenimi from "../AI-algorithms/OpenAI-reply-format/suggestTouristDataGenimi.js";
import Page from "../models/Page.js";
import TouristDestination from "../models/TouristDestination.js";

const getAll = async () => {
    return await TouristDestination.find();
};

const getById = async (id) => {
    return await TouristDestination.findById(id);
};

const createTouristDestination = async (data) => {
    return await TouristDestination.create(data)
}

const updateTouristDestinationById = async (id, data) => {
    return await TouristDestination.findByIdAndUpdate(id, data, { new: true })
}

const updateAllTouristDestinations = async (data) => {
    return await TouristDestination.updateMany({}, data, { new: true })
}

const deleteTouristDestinationById = async (id) => {
    return await TouristDestination.findByIdAndDelete(id)
}

const createTouristDestinationByPageId = async (pageId) => {
    try {
        const page = await Page.findById(pageId).populate('address');
        if (!page) {
          return { success: false, message: 'Không tồn tại trang với id tương ứng!' };
        }
        if (!page.address) {
          return { success: false, message: 'Trang này không có địa chỉ cụ thể!' };
        }

        const existingTourist = await TouristDestination.findOne({ pageId: pageId });
        if (existingTourist) {
          return { success: false, message: 'Trang này đã tồn tại điểm du lịch!' };
        }

        const suggestion = await suggestTouristDataGenimi(page.address, page.name);
        if (suggestion.name !== null) {
          const result = await TouristDestination.create({
            name: suggestion.name,
            pageId: pageId,
            province: suggestion.province,
            best_months: suggestion.bestMonths,
            tags: suggestion.tags,
            coordinates: [page.address.lat, page.address.long],
          });
          return {success: true, data: result}
        }

        return {success: false, message: "Thông tin của trang chưa đủ cơ sở tạo Điểm du lịch"}
    }
    catch (err){
        return {success: false, message: err.message}
    }
}

const touristDestinationService = {
    getAll,
    getById,
    createTouristDestination,
    updateTouristDestinationById,
    updateAllTouristDestinations,
    deleteTouristDestinationById,
    createTouristDestinationByPageId
}

export default touristDestinationService;