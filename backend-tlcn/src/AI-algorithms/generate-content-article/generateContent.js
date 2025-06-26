import dotenv from 'dotenv';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import axios from 'axios';
import { env } from '../../config/environment.js';

dotenv.config();

// Khởi tạo Google Cloud Vision client
const visionClient = new ImageAnnotatorClient();

const generateContent = async (req, res) => {
  try {
    // Kiểm tra file ảnh
    if (!req.files || !req.files.images || req.files.images.length === 0 || req.files.images.length > 5) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp 1-5 file ảnh!' });
    }

    // Phân tích tất cả ảnh bằng Google Cloud Vision API
    let imageTags = [];
    for (const file of req.files.images) {
      const [result] = await visionClient.labelDetection({ image: { content: file.buffer } });
      const labels = result.labelAnnotations.map(label => ({
        tag: label.description,
        weight: label.score
      }));
      imageTags = [...imageTags, ...labels];
    }

    // Loại bỏ tag trùng lặp, giữ tag có weight cao nhất
    const tagMap = new Map();
    for (const tag of imageTags) {
      if (!tagMap.has(tag.tag.toLowerCase()) || tagMap.get(tag.tag.toLowerCase()).weight < tag.weight) {
        tagMap.set(tag.tag.toLowerCase(), tag);
      }
    }
    const uniqueTags = [...tagMap.values()];

    if (uniqueTags.length === 0) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy tag nào từ ảnh!' });
    }

    // Gọi Gemini API để sinh nội dung
    const geminiApiKey = env.API_KEY_GENIMI;
    if (!geminiApiKey) {
      return res.status(500).json({ success: false, message: 'Thiếu Gemini API key!' });
    }

    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    const prompt = `Viết một đoạn văn ngắn (20-30 từ) bằng tiếng Việt mô tả cảnh ưu tiên Việt Nam chủ yếu dựa trên các thẻ: ${uniqueTags.map(t => t.tag).join(', ')}. Nội dung phải tự nhiên, hấp dẫn và phù hợp để đăng bài viết du lịch.`;
    const geminiResponse = await axios.post(`${geminiUrl}?key=${geminiApiKey}`, {
      contents: [{ parts: [{ text: prompt }] }]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const generatedContent = geminiResponse.data.candidates[0].content.parts[0].text || 'Không thể sinh nội dung.';

    return res.status(200).json({
      success: true,
      data: {
        imageTags: uniqueTags,
        generatedContent
      }
    });
  } catch (error) {
    console.error('Lỗi khi sinh nội dung:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xử lý.',
      error: error.message
    });
  }
};

export default generateContent;