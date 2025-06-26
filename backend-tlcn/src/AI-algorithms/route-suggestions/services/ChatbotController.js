import  {genimiAnswerChatbot}  from "./genimiAnswerChatbot.js";

const getChatbot =  async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Câu hỏi không hợp lệ. Vui lòng cung cấp một chuỗi văn bản.',
        });
      }

      const answer = await genimiAnswerChatbot.getGenimiChatbot(query);
      res.status(200).json({
        success: true,
        data: { answer },
        message: 'Câu trả lời từ chatbot',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        data: null,
        message: error.message || 'Lỗi xử lý câu hỏi chatbot',
      });
    }
  }
export const ChatbotController = {getChatbot};