import addFriendService from '../services/addFriendService.js'

const getAddFriends = async (req, res) => {
  try {
    const AddFriends = await addFriendService.getAll()
    res.status(200).json({ success: true, data: AddFriends, message: 'Lấy danh sách yêu cầu kết bạn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getAddFriendById = async (req, res) => {
  try {
    const AddFriend = await addFriendService.getById(req.params.id)
    if (!AddFriend) return res.status(404).json({ success: false, data: null, message: 'Yêu cầu kết bạn không tồn tại' })
    res.status(200).json({ success: true, data: AddFriend, message: 'Lấy yêu cầu kết bạn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createAddFriend = async (req, res) => {
  try {
    const newAddFriend = await addFriendService.createAddFriend(req.body)
    res.status(201).json({ success: true, data: newAddFriend, message: 'Tạo yêu cầu kết bạn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAddFriendById = async (req, res) => {
  try {
    const updatedAddFriend = await addFriendService.updateAddFriendById(req.params.id, req.body)
    if (!updatedAddFriend) return res.status(404).json({ success: false, data: null, message: 'Yêu cầu kết bạn không tồn tại' })
    res.status(200).json({ success: true, data: updatedAddFriend, message: 'Cập nhật yêu cầu kết bạn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllAddFriends = async (req, res) => {
  try {
    const updatedAddFriends = await addFriendService.updateAllAddFriends(req.body)
    res.status(200).json({ success: true, data: updatedAddFriends, message: 'Cập nhật tất cả yêu cầu kết bạn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteAddFriendById = async (req, res) => {
  try {
    const deletedAddFriend = await addFriendService.deleteAddFriendById(req.params.id)
    if (!deletedAddFriend) return res.status(404).json({ success: false, data: null, message: 'Yêu cầu kết bạn không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa yêu cầu kết bạn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getAddFriendBySenderId = async (req, res) => {
  try {
    const dataAddFriend = await addFriendService.getAddFriendBySenderId(req.params.id)
    if (!dataAddFriend) return res.status(404).json({ success: false, data: null, message: 'Không có thông tin' })
    res.status(200).json({ success: true, data: dataAddFriend, message: 'Lấy danh sách kết bạn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getAddFriendByReceiverId = async (req, res) => {
  try {
    const dataAddFriend = await addFriendService.getAddFriendByReceiverId(req.params.id)
    if (!dataAddFriend) return res.status(404).json({ success: false, data: null, message: 'Không có thông tin' })
    res.status(200).json({ success: true, data: dataAddFriend, message: 'Lấy danh sách kết bạn thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const AddFriendController = {
  getAddFriends,
  getAddFriendById,
  createAddFriend,
  updateAddFriendById,
  updateAllAddFriends,
  deleteAddFriendById,
  getAddFriendBySenderId,
  getAddFriendByReceiverId,
}

export  default AddFriendController;