import conversationService from '../services/conversationService.js'

const getConversations = async (req, res) => {
  try {
    const Conversations = await conversationService.getAll()
    res.status(200).json({ success: true, data: Conversations, message: 'Lấy danh sách cuộc thoại thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getConversationById = async (req, res) => {
  try {
    const Conversation = await conversationService.getById(req.params.id)
    if (!Conversation) return res.status(404).json({ success: false, data: null, message: 'cuộc thoại không tồn tại' })
    res.status(200).json({ success: true, data: Conversation, message: 'Lấy cuộc thoại thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getByUserAndFriendId = async (req, res) => {
  try {
    const Conversation = await conversationService.getByUserAndFriendId(req.params.id, req.query.friendId)
    if (!Conversation) return res.status(404).json({ success: false, data: null, message: 'cuộc thoại không tồn tại' })
    res.status(200).json({ success: true, data: Conversation, message: 'Lấy cuộc thoại thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createConversation = async (req, res) => {
  try {
    const newConversation = await conversationService.createConversation(req.body)
    if (!newConversation.success) {
      res.status(400).json({ success: false, message: newConversation.message })
    } else {
      res.status(201).json({ success: true, data: newConversation.data, message: 'Tạo cuộc thoại thành công' })
    }
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateConversationById = async (req, res) => {
  try {
    const updatedConversation = await conversationService.updateConversationById(req.params.id, req.body)
    if (!updatedConversation) return res.status(404).json({ success: false, data: null, message: 'cuộc thoại không tồn tại' })
    res.status(200).json({ success: true, data: updatedConversation, message: 'Cập nhật cuộc thoại thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllConversations = async (req, res) => {
  try {
    const updatedConversations = await conversationService.updateAllConversations(req.body)
    res.status(200).json({ success: true, data: updatedConversations, message: 'Cập nhật tất cả cuộc thoại thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteConversationById = async (req, res) => {
  try {
    const deletedConversation = await conversationService.deleteConversationById(req.params.id)
    if (!deletedConversation) return res.status(404).json({ success: false, data: null, message: 'cuộc thoại không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa cuộc thoại thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getConversationFriends = async (req, res) => {
  try {
    const result = await conversationService.getConversationFriends(req.params.id)
    if (!result.success) return res.status(400).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result.data, message: 'Lấy dữ liệu thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getConversationWithoutFriends = async (req, res) => {
  try {
    const result = await conversationService.getConversationWithoutFriends(req.params.id)
    if (!result.success) return res.status(400).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result.data, message: 'Lấy dữ liệu thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getFriendsWithoutPrivateChat = async (req, res) => {
  try {
    const result = await conversationService.getFriendsWithoutPrivateChat(req.params.id)
    if (!result.success) return res.status(404).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result.data, message: 'Lấy dữ liệu thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateUserSetting = async (req, res) => {
  try {
    const result = await conversationService.updateUserSetting(req.params.id, req.body.setting);
    if (!result.success) return res.status(404).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result.data, message: 'Cập nhật thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateSos = async (req, res) => {
  try {
    const { conversationsId } = req.body;
    const result = await conversationService.updateSos(conversationsId, req.params.id);
    if (!result.success) return res.status(400).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result.data, message: result.message })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getSosConversations = async (req, res) => {
  try {
    const result = await conversationService.getSosConversations(req.params.id);
    if (!result.success) return res.status(400).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result.data, message: result.message })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateParticipantsAndSettings = async (req, res) => {
  try {
    const result = await conversationService.updateParticipantsAndSettings(req.params.id, req.body.userIds);
    if (!result.success) return res.status(400).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result.data, message: result.message })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getConversationOfPages = async (req, res) => {
  try {
    const result = await conversationService.getConversationOfPages(req.params.id)
    if (!result.success) return res.status(400).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result.data, message: 'Lấy dữ liệu thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const changeAvtGroup = async (req, res) => {
  try {
    const result = await conversationService.changeAvtGroup(req.params.id, req.body.userId, req.file)
    if (!result.success) return res.status(400).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result.data, message: 'Cập nhật thành công' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const ConversationController = {
  getConversations,
  getConversationById,
  createConversation,
  updateConversationById,
  updateAllConversations,
  deleteConversationById,
  getConversationFriends,
  getFriendsWithoutPrivateChat,
  getConversationWithoutFriends,
  updateUserSetting,
  updateSos,
  getSosConversations,
  updateParticipantsAndSettings,
  getConversationOfPages,
  changeAvtGroup,
  getByUserAndFriendId
}

export  default ConversationController;