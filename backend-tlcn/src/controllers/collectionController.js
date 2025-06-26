import collectionService from '../services/collectionService.js'

const getCollections = async (req, res) => {
  try {
    const Collections = await collectionService.getAll()
    res.status(200).json({ success: true, data: Collections, message: 'Lấy danh sách bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getCollectionById = async (req, res) => {
  try {
    const Collection = await collectionService.getById(req.params.id)
    if (!Collection) return res.status(404).json({ success: false, data: null, message: 'Bộ sưu tập không tồn tại' })
    res.status(200).json({ success: true, data: Collection, message: 'Lấy bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createCollection = async (req, res) => {
  try {
    const newCollection = await collectionService.createCollection(req.body)
    res.status(201).json({ success: true, data: newCollection, message: 'Tạo bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateCollectionById = async (req, res) => {
  try {
    const updatedCollection = await collectionService.updateCollectionById(req.params.id, req.body)
    if (!updatedCollection) return res.status(404).json({ success: false, data: null, message: 'Bộ sưu tập không tồn tại' })
    res.status(200).json({ success: true, data: updatedCollection, message: 'Cập nhật bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllCollections = async (req, res) => {
  try {
    const updatedCollections = await collectionService.updateAllCollections(req.body)
    res.status(200).json({ success: true, data: updatedCollections, message: 'Cập nhật tất cả bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteCollectionById = async (req, res) => {
  try {
    const deletedCollection = await collectionService.deleteCollectionById(req.params.id)
    if (!deletedCollection) return res.status(404).json({ success: false, data: null, message: 'Bộ sưu tập không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const addNewItemCollection = async (req, res) => {
  try {
    const { id, idarticle } = req.params; 
    const result = await collectionService.addNewItem(id, idarticle); 

    if (!result.success) {
      return res.status(result.code).json({ success: false, data: null, message: result.message });
    }

    res.status(200).json({ success: true, data: result.data, message: result.message });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const deleteItemCollection = async (req, res) => {
  try {
    const { itemId } = req.body;
    const result = await collectionService.deleteItem(req.params.id, itemId);
    if (!result) return res.status(404).json({ success: false, data: null, message: 'Bộ sưu tập không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const getAllArticlebyId = async (req, res) => {
  try {
    const result = await collectionService.getAllArticlebyId(req.params.id)
    if (!result) return res.status(404).json({ success: false, data: null, message: 'Bộ sưu tập không tồn tại' })
    res.status(200).json({ success: true, data: result.data, message: 'Lấy danh sách bài viết thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const changeCollections = async (req, res) => {
  try {
    const {currCollectionId, newCollectionId, itemId} = req.body;
    const result = await collectionService.changeCollections(currCollectionId, newCollectionId, itemId);
    if (!result) return res.status(result.code).json({ success: false, data: null, message: result.message })
    res.status(200).json({ success: true, data: result.data, message: 'Thay đổi bộ sưu tập thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const CollectionController = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollectionById,
  updateAllCollections,
  deleteCollectionById,
  addNewItemCollection,
  deleteItemCollection,
  getAllArticlebyId,
  changeCollections
}

export  default CollectionController;