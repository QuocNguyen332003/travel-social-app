import optimizeRoute from "./services/optimizeRoute.js";

const routeSuggested = async (req, res) => {
  try {
    const result = await optimizeRoute(req.body);
    if (!result) return res.status(400).json({ success: false, message: 'Không thể gợi ý' });
    res.status(200).json({ success: true, data: result, message: 'Danh sách gợi ý địa điểm du lịch cho người dùng' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const routeSuggestions = {
    routeSuggested
}

export default routeSuggestions;