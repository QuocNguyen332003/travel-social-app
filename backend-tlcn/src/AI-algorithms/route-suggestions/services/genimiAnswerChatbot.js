import { GoogleGenAI } from "@google/genai";
import { env } from "../../../config/environment.js";
import mongoose from 'mongoose';
import TouristDestination from "../../../models/TouristDestination.js";
import Page from "../../../models/Page.js";
import Article from "../../../models/Article.js";
import Reels from "../../../models/Reels.js";
import Group from "../../../models/Group.js";
import travelSocialNetwork from "./travelSocialNetwork.js";

// Khởi tạo Google Gemini AI
const ai = new GoogleGenAI({ apiKey: env.API_KEY_GENIMI });

const getGenimiChatbot = async (userQuery) => {
  try {
    console.log("Received user query:", userQuery);

    // Kiểm tra đầu vào
    if (!userQuery || typeof userQuery !== 'string' || userQuery.trim().length === 0) {
      return "Vui lòng cung cấp câu hỏi hợp lệ.";
    }
    // Tìm kiếm tất cả dữ liệu trong các collection
    const searchResults = await Promise.all([
      // Lấy tất cả dữ liệu từ TouristDestination
      TouristDestination.find({})
        .lean(),  
      // Lấy tất cả dữ liệu từ Page
      Page.find({})
        .lean(),
      // Lấy tất cả dữ liệu từ Article
      Article.find({})
        .lean(),
      // Lấy tất cả dữ liệu từ Reels
      Reels.find({})
        .lean(),
      // Lấy tất cả dữ liệu từ Group
      Group.find({})
        .lean(),
    ]);

    // Gộp và định dạng dữ liệu tìm kiếm
    const context = [];

    // Xử lý dữ liệu từ TouristDestination
    if (searchResults[0].length > 0) {
      context.push(
        `*Thông tin điểm du lịch*:\n${searchResults[0]
          .map(
            (dest) =>
              `*${dest.name}* (${dest.province}). Thời gian lý tưởng: tháng ${dest.best_months.join(", ")}. Tọa độ: [${dest.coordinates?.join(", ") || "Không có"}].`
          )
          .join("\n")}`
      );
    }

    // Xử lý dữ liệu từ Page
    if (searchResults[1].length > 0) {
      context.push(
        `*Thông tin trang*:\n${searchResults[1]
          .map(
            (page) =>
              `*${page.name}*:. Số người theo dõi: ${page.follower?.length || 0}.`
          )
          .join("\n")}`
      );
    }

    // Xử lý dữ liệu từ Article
    if (searchResults[2].length > 0) {
      context.push(
        `*Bài viết liên quan*:\n${searchResults[2]
          .map(
            (article) =>
              `*Bài viết*: ${article.content?.substring(0, 100) || "Không có nội dung"}... Hashtag: ${article.hashTag?.join("") || "Không có"}.`
          )
          .join("\n")}`
      );
    }

    // Xử lý dữ liệu từ Reels
    if (searchResults[3].length > 0) {
      context.push(
        `*Reels liên quan*:\n${searchResults[3]
          .map(
            (reel) =>
              `*Reels*: ${reel.content?.substring(0, 100) || "Không có nội dung"}... Hashtag: ${reel.hashTag?.join(", ") || "Không có"}.`
          )
          .join("\n")}`
      );
    }

    // Xử lý dữ liệu từ Group
    if (searchResults[4].length > 0) {
      context.push(
        `*Nhóm liên quan*:\n${searchResults[4]
          .map(
            (group) =>
              `*${group.groupName}* (${group.type}): ${group.introduction || "Không có mô tả"}. Số thành viên: ${group.members?.length || 0}.`
          )
          .join("\n")}`
      );
    }
    // Tạo prompt cho Gemini, bao gồm nội dung từ support_data.tsx
    const systemPrompt = `Bạn là trợ lý hỗ trợ khách hàng cho mạng xã hội du lịch VieWay. Nhiệm vụ là trả lời câu hỏi của người dùng bằng tiếng Việt, dựa trên thông tin từ cơ sở dữ liệu và tài liệu dưới đây, khi trả lời thêm hashtag những bài viết có liên quan đến câu hỏi, và các nhóm và trang có liên quan. Chỉ sử dụng hashtag từ bài viết liên quan khi câu hỏi liên quan đến du lịch . Nếu không có dữ liệu liên quan, hãy trả lời bằng kiến thức chung và giữ giọng điệu thân thiện, truyền cảm hứng.

--- NỘI DUNG TÀI LIỆU ---
### Thông tin từ cơ sở dữ liệu
${context.length > 0 ? context.join("\n\n") : "Không có dữ liệu liên quan từ cơ sở dữ liệu."}

### Thông tin từ tài liệu VieWay
${travelSocialNetwork}

--- HẾT ---

Câu hỏi của người dùng: ${userQuery}`;

    // Gọi Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: systemPrompt,
    });

    const answer = response?.candidates?.[0]?.content?.parts?.[0]?.text || "Không thể tạo câu trả lời.";
    return answer;
  } catch (error) {
    console.error("Lỗi xử lý câu hỏi chatbot:", error.message, error.stack);
    return "Không thể xử lý câu hỏi. Vui lòng thử lại sau.";
  }
};

export const genimiAnswerChatbot = {
  getGenimiChatbot,
};