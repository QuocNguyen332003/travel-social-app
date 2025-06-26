import axios from 'axios';
import { env } from '../../config/environment.js';

async function suggestTouristData(pageName) {
  const prompt = `Gợi ý giúp tôi:
- Tên tỉnh của điểm du lịch ${pageName} (trả về tên ngắn gọn, ví dụ Đồng Tháp)
- Những tháng đẹp nhất để du lịch ${pageName} (trả về danh sách số tháng, ví dụ [1,2,3])
- Những tags phù hợp cho ${pageName} (trả về danh sách các tag tiếng Anh từ danh sách sau: [
          'mountain',           // Núi
          'beach',             // Biển
          'forest',            // Rừng
          'grassland',         // Thảo nguyên
          'desert',            // Sa mạc
          'river',             // Sông
          'lake',              // Hồ
          'waterfall',         // Thác nước
          'cave',              // Hang động
          'rice_field',        // Đồng lúa, ruộng bậc thang
          'flower_field',      // Vườn hoa
          'sky',               // Bầu trời
          'island',            // Đảo
          'volcano',           // Núi lửa
          'national_park',     // Vườn quốc gia
          'canyon',            // Hẻm núi
          'snow',              // Băng tuyết
          'wildlife',          // Động vật hoang dã
          'bird',              // Chim
          'livestock',         // Gia súc
          'marine_life',       // Động vật biển
          'festival',          // Lễ hội
          'traditional_costume', // Trang phục truyền thống
          'market',            // Chợ
          'cuisine',           // Ẩm thực
          'village',           // Làng quê
          'local_people',      // Người dân địa phương
          'ceremony',          // Nghi thức truyền thống
          'street_art',        // Nghệ thuật đường phố
          'historical_site',   // Di tích lịch sử
          'landmark',          // Công trình biểu tượng
          'bridge',            // Cầu
          'cityscape',         // Thành phố
          'traditional_house', // Nhà truyền thống
          'old_town',          // Phố cổ
          'castle',            // Lâu đài
          'trekking',          // Trekking
          'diving',            // Lặn biển
          'camping',           // Cắm trại
          'kayaking',          // Chèo thuyền
          'hot_air_balloon',   // Khinh khí cầu
          'cycling',           // Xe đạp
          'motorcycling',      // Mô tô
          'skiing',            // Trượt tuyết
          'surfing',           // Lướt sóng
          'paragliding',       // Nhảy dù
          'street',            // Đường phố
          'transport',         // Phương tiện giao thông
          'tree',              // Cây cối
          'weather',           // Thời tiết
          'light',             // Ánh sáng
          'signpost',          // Bảng chỉ đường
          'season',            // Mùa
          'sunset',            // Hoàng hôn
          'sunrise',           // Bình minh
          'aurora',            // Cực quang
          'night_sky',          // Bầu trời đêm
          'rock',                // Đá, bãi đá,...
          'lantern',             // Đèn lồng
          'photography',
          'clouds',
        ])`;

  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'Bạn là chuyên gia du lịch Việt Nam, trả lời đúng format yêu cầu.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
  }, {
    headers: {
      'Authorization': `Bearer ${env.API_KEY_TOURIST}`,
      'Content-Type': 'application/json'
    }
  });

  const reply = response.data.choices[0].message.content;
  return reply;
}

export default suggestTouristData;