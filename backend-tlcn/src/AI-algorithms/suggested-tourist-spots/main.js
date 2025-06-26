import { getRecommendedPageCF, getRecommendedPagesCB, getRecommendedWithMonth } from "./hybridRecommendation.js";

const suggestedPageCF = async (userId) => {
  try {
    const result = await getRecommendedPageCF(userId);
    return { success: true, data: result };
  } catch (error){
    return { success: false, message: error.message };
  }
};

const suggestedPageCB = async (userId) => {
  try {
    const result = await getRecommendedPagesCB(userId);
    return { success: true, data: result };
  } catch (error){
    return { success: false, message: error.message };
  }
};

const suggestedPageMonth = async (userId, month) => {
  try {
    const result = await getRecommendedWithMonth(userId, month);
    if (result.success) return { success: true, data: result };
    return { success: false, message: result.message };
  } catch (error){
    return { success: false, message: error.message };
  }
};

const suggestedPageService = {
  suggestedPageCF,
  suggestedPageCB,
  suggestedPageMonth
}

export default suggestedPageService;