import data_preparation from "./data_preparation.js";
import recommendationsCB from "./content_base_v2.js";
import { getRecommendedPagesWithDetails } from "./collaborative_filtering_v2.js";
import TouristDestination from "../../models/TouristDestination.js";

async function getRecommendedPageCF(currentUserId, topN = 5) {
    const allUser = await data_preparation.getAllUserProfiles();
    return getRecommendedPagesWithDetails(currentUserId, allUser);
}
  
async function getRecommendedPagesCB(currentUserId, topN = 5) {
    const dataUser = await data_preparation.dataPreparationUser(currentUserId);
    const dataPages = await data_preparation.dataPreparationPages();
    const resultContentbase = await recommendationsCB(dataUser, dataPages);
    return resultContentbase;
}

async function getRecommendedWithMonth(currentUserId, month) {
    try {
    const dataUser = await data_preparation.dataPreparationUser(currentUserId);
    if (!month || month < 1 || month > 12) {
      return { success: false, message: 'Tháng không hợp lệ' };
    }

    // B1: Lọc TouristDestination theo tháng
    const destinations = await TouristDestination.find({
      best_months: month
    }).select('pageId');

    const pageIds = destinations.map(d => d.pageId);
    if (pageIds.length === 0) {
      return { success: true, data: [], message: 'Không có gợi ý phù hợp' };
    }

    const allPagesData = await data_preparation.dataPreparationPagesList(pageIds);

    // B3: Gọi content-based recommender
    const results = await recommendationsCB(dataUser, allPagesData);
    return { success: true, data: results };

  } catch (error) {
    return { success: true, message: error.message };
  }
}

export {
    getRecommendedPageCF,
    getRecommendedPagesCB,
    getRecommendedWithMonth
};