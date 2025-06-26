import suggestedPageService from "./main.js";


const suggestedPageCF = async (req, res) => {
  try {
    const result = await suggestedPageService.suggestedPageCF(req.params.id);
    if (!result.success) return res.status(400).json({ success: false, message: result.message });
    
    res.status(200).json({ success: true, data: result.data, message: 'Danh sách gợi ý địa điểm du lịch cho người dùng' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const suggestedPageCB = async (req, res) => {
  try {
    const result = await suggestedPageService.suggestedPageCB(req.params.id);
    if (!result.success) return res.status(400).json({ success: false, message: result.message });
    
    res.status(200).json({ success: true, data: result.data, message: 'Danh sách gợi ý địa điểm du lịch cho người dùng' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const suggestedPageMonth = async (req, res) => {
  try {
    const result = await suggestedPageService.suggestedPageMonth(req.params.id, req.query.month);
    if (!result.success) return res.status(400).json({ success: false, message: result.message });
    
    res.status(200).json({ success: true, data: result.data.data, message: 'Danh sách gợi ý địa điểm du lịch cho người dùng' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const SuggestTouristController = {
    suggestedPageCF,
    suggestedPageCB,
    suggestedPageMonth
}

export default SuggestTouristController;