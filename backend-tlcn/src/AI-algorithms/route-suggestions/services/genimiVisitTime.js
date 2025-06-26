import { GoogleGenAI } from "@google/genai";
import { env } from "../../../config/environment.js";

const ai = new GoogleGenAI({ apiKey: env.API_KEY_GENIMI });
  
async function genimiVisitTime(points, date) {
  const places = points.map((p) => p.displayName || p.address).join(", ");
  const prompt = `Cho tôi thời gian lý tưởng khi ghé thăm các địa điểm sau vào ngày ${date}: ${places}.
  Hãy trả về **duy nhất** một đối tượng JSON theo định dạng sau và **không có bất kỳ văn bản giải thích nào khác**:
  \`\`\`json
  {
    "tên địa điểm 1": {
      "startHour": <giờ bắt đầu>,
      "endHour": <giờ kết thúc>
    },
    "tên địa điểm 2": {
      "startHour": <giờ bắt đầu>,
      "endHour": <giờ kết thúc>
    },
    ...
  }
  \`\`\``;


  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      try {
        const parsedData = parseAndCleanJSON(text);
        // Tạo một bản đồ (Map) để dễ dàng tìm kiếm thời gian theo tên địa điểm
        const visitTimeMap = new Map();
        for (const placeName in parsedData) {
          if (parsedData.hasOwnProperty(placeName)) {
            visitTimeMap.set(placeName.toUpperCase().trim(), parsedData[placeName]);
          }
        }

        // Duyệt qua mảng points ban đầu và thêm idealVisitTime
        const enrichedPoints = points.map((point) => {
          const searchName = (point.displayName || point.address || "").toUpperCase().trim();
          const idealVisitTime = visitTimeMap.get(searchName) || null;
          return {
            ...point._doc,
            idealVisitTime: idealVisitTime,
          };
        });

        return enrichedPoints;
      } catch (error) {
        console.error("Lỗi khi parse JSON:", error);
        return points.map((point) => ({ ...point, idealVisitTime: null }));
      }
    } else {
      console.error("Không nhận được phản hồi hợp lệ từ mô hình.");
      return null;
    }
  } catch (error) {
    console.error("Đã xảy ra lỗi khi gọi mô hình:", error);
    return null;
  }
}

function parseAndCleanJSON(text) {
  try {
    // Loại bỏ các dấu backtick và dòng trắng thừa ở đầu và cuối chuỗi
    const cleanedText = text.trim().replace(/^```json\s*|```$/g, '');
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Lỗi khi parse JSON sau khi làm sạch:", error);
    return null;
  }
}

export default genimiVisitTime;