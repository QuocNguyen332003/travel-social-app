import messageService from '../services/messageService.js'

const getMessages = async (req, res) => {
  try {
    const Messages = await messageService.getAll()
    res.status(200).json({ success: true, data: Messages, message: 'Lấy danh sách Tin nhắn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getMessageById = async (req, res) => {
  try {
    const Message = await messageService.getById(req.params.id)
    if (!Message) return res.status(404).json({ success: false, data: null, message: 'Tin nhắn không tồn tại' })
    res.status(200).json({ success: true, data: Message, message: 'Lấy Tin nhắn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createMessage = async (req, res) => {
  try {
    const result = await messageService.createMessage(req.body, req.file);

    res.status(201).json({
      success: true,
      data: result,
      message: "Tạo bài viết thành công",
    });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
}

const updateMessageById = async (req, res) => {
  try {
    const updatedMessage = await messageService.updateMessageById(req.params.id, req.body)
    if (!updatedMessage) return res.status(404).json({ success: false, data: null, message: 'Tin nhắn không tồn tại' })
    res.status(200).json({ success: true, data: updatedMessage, message: 'Cập nhật Tin nhắn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllMessages = async (req, res) => {
  try {
    const updatedMessages = await messageService.updateAllMessages(req.body)
    res.status(200).json({ success: true, data: updatedMessages, message: 'Cập nhật tất cả Tin nhắn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteMessageById = async (req, res) => {
  try {
    const deletedMessage = await messageService.deleteMessageById(req.params.id)
    if (!deletedMessage) return res.status(404).json({ success: false, data: null, message: 'Tin nhắn không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa Tin nhắn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getMessagesByConversationId = async (req, res) => {
  try {
    const result = await messageService.getMessagesByConversationId(req.params.id, req.query.limit, req.query.skip)
    if (!result) return res.status(404).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result, message: 'Lấy dữ liệu thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getPhotosByConversation = async (req, res) => {
  try {
    const result = await messageService.getPhotosByConversation(req.params.id)
    if (!result.success) return res.status(404).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result.data, message: 'Lấy dữ liệu thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getMessagePhoto = async (req, res) => {
  try {
    const result = await messageService.getMessagePhoto(req.params.id, req.query.type, req.query.limit, req.query.skip)
    if (!result) return res.status(404).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result, message: 'Lấy dữ liệu thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const seenMessage = async (req, res) => {
  try {
    const result = await messageService.seenMessage(req.params.id, req.body.userId)
    if (!result) return res.status(404).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result, message: 'Cập nhật thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const MessageController = { 
  getMessages,
  getMessageById,
  createMessage,
  updateMessageById,
  updateAllMessages,
  deleteMessageById,
  getMessagesByConversationId,
  getPhotosByConversation,
  getMessagePhoto,
  seenMessage
}

export  default MessageController;