import { GoogleGenAI } from "@google/genai";
import { env } from "../../config/environment.js";

const ai = new GoogleGenAI({ apiKey: env.API_KEY_GENIMI });

async function suggestTouristDataGenimi(addressData, pageName) {
  const parts = [
  addressData.placeName,
  addressData.street,
  addressData.ward,
  addressData.district,
  addressData.province
  ];
  const locationString = parts.filter(Boolean).join(', ');

  const prompt = `Với địa chỉ ${locationString} tên gợi ý ${pageName} (tên này có thể không chính xác) tìm kiếm giúp tôi:
- Tên của điểm du lịch trên (trả về tên ngắn gọn, ví dụ "Vịnh Hạ Long")
- Tên tỉnh của điểm du lịch trên (trả về tên ngắn gọn, ví dụ Đồng Tháp)
- Những tháng đẹp nhất để du lịch trên (trả về danh sách số tháng, ví dụ [1,2,3])
- Những tags phù hợp cho điểm du lịch trên (trả về danh sách các tag tiếng Anh từ danh sách sau: [
      "Nature",
      "Wildlife & Creatures",
      "Culture & People",
      "Architecture & Heritage",
      "Accommodation & Services",
      "Food & Drink"
    ]
Chỉ trả về theo mẫu sau: {
  name: "...",
  province: "...",
  bestMonths: [],
  tags: []
}
Nếu địa chỉ ${locationString} không phải là điểm du lịch hay điểm đặc biệt thì trả về: {
  name: null,
  province: "...",
  bestMonths: [],
  tags: []
}
Không có thêm bất kì giải thích hay chi tiết khác.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      try {
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanedText);
        const { name, province, bestMonths, tags } = data;
        return { name, province, bestMonths, tags };
      } catch (error) {
        console.error("Lỗi khi phân tích JSON:", error);
        return null;
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

export default suggestTouristDataGenimi;