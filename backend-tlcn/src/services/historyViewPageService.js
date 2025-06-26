import HistoryViewPage from '../models/HistoryViewPage.js';

const getAll = async () => {
    return await HistoryViewPage.find();
};

const getById = async (id) => {
    return await HistoryViewPage.findById(id);
};

const createHistoryViewPage = async (data) => {
    const existingRecord = await HistoryViewPage.findOne({
        idUser: data.idUser,
        idPage: data.idPage
    });

    if (existingRecord) {
        // Nếu tồn tại, cập nhật viewDate
        existingRecord.viewDate = Date.now();
        await existingRecord.save();
        return existingRecord;
    } else {
        // Nếu chưa có, tạo mới
        return await HistoryViewPage.create(data);
    }
}

const updateHistoryViewPageById = async (id, data) => {
    return await HistoryViewPage.findByIdAndUpdate(
        id,
        { ...data, viewDate: Date.now() }, // Luôn cập nhật viewDate
        { new: true }
    );
}


const updateAllHistoryViewPages = async (data) => {
    return await HistoryViewPage.updateMany({}, data, { new: true })
}

const deleteHistoryViewPageById = async (id) => {
    return await HistoryViewPage.findByIdAndDelete(id)
}

const getViewByUserId = async (userId) => {
    const views = await HistoryViewPage.find({ idUser: userId })
        .populate({
            path: 'idPage',
            select: '_id name avt',
            populate: {
                path: 'avt',
                model: 'MyPhoto'
            },
        })
        .sort({ viewDate: -1 });

    return views;
};


const historyViewPageService = {
    getAll,
    getById,
    createHistoryViewPage,
    updateHistoryViewPageById,
    updateAllHistoryViewPages,
    deleteHistoryViewPageById,
    getViewByUserId
}

export default historyViewPageService;