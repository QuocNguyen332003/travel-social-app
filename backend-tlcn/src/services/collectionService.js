import Collection from '../models/Collection.js';
import Article from '../models/Article.js'
import User from '../models/User.js'
import mongoose from 'mongoose';

const getAll = async () => {
    return await Collection.find();
};

const getById = async (id) => {
    return await Collection.findById(id);
};

const createCollection = async (data) => {

    const formattedItems = data.item.length > 0 ? data.items.map(item => ({
        _id: item,
        updateDate: new Date(),
    })) : [];

    return await Collection.create({
        name: data.name,
        items: formattedItems,
        type: data.type,
    })
}

const updateCollectionById = async (id, data) => {
    return await Collection.findByIdAndUpdate(id, data, { new: true })
}

const updateAllCollections = async (data) => {
    return await Collection.updateMany({}, data, { new: true })
}

const deleteCollectionById = async (id) => {
    return await Collection.findByIdAndDelete(id)
}

// const addNewItem = async (id, itemId) => {
//     if (!mongoose.Types.ObjectId.isValid(itemId)) {
//       return { success: false, code: 400, data: null, message: "ID của item không hợp lệ" };
//     }
  
//     const collection = await Collection.findById(id);
//     if (!collection) {
//       return { success: false, code: 404, data: null, message: "Không tìm thấy bộ sưu tập" };
//     }
  
//     const isItemExists = collection.items.some(item => item._id.toString() === itemId);
//     if (isItemExists) {
//       return { success: false, code: 409, data: null, message: "Đã tồn tại trong bộ sưu tập" };
//     }
  
//     const updatedCollection = await Collection.findByIdAndUpdate(
//       id,
//       { 
//         $push: { 
//           items: {
//             _id: itemId,
//             updateDate: Date.now(),
//           } 
//         } 
//       }, 
//       { new: true }
//     );
  
//     return { success: true, code: 200, data: updatedCollection, message: "Thành công thêm vào bộ sưu tập" };
//   };


const addNewItem = async (id, itemId) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return { success: false, code: 400, data: null, message: "ID của item không hợp lệ" };
  }

  const collection = await Collection.findById(id);
  if (!collection) {
    return { success: false, code: 404, data: null, message: "Không tìm thấy bộ sưu tập" };
  }

  const isItemExists = collection.items.some(item => item._id.toString() === itemId);
  if (isItemExists) {
    return { success: false, code: 409, data: null, message: "Đã tồn tại trong bộ sưu tập" };
  }

  const updatedCollection = await Collection.findByIdAndUpdate(
    id,
    { 
      $push: { 
        items: {
          _id: itemId,
          updateDate: Date.now(),
        } 
      } 
    }, 
    { new: true }
  );

  return { success: true, code: 200, data: updatedCollection, message: "Thành công thêm vào bộ sưu tập" };
};

const deleteItem = async (id, itemId) => {
    return await Collection.findByIdAndUpdate(
        id,
        { 
            $pull: { "items": { _id: itemId } }
        }, 
        { new: true }
    );
};

const changeCollections = async (currCollectionId, newCollectionId, itemId) => {
    const result = await addNewItem(newCollectionId, itemId);
    if (result.success){
        await deleteItem(currCollectionId, itemId);
        return {success: true, code: 200, data: null, message: "Thay đổi thành công"}
    }
    return {success: true, code: result.code, data: null, message: result.message}
};

const getAllArticlebyId = async (id) => {
    const collections = await Collection.findById(id);

    if (!collections){
        return {success: false, code: 404, data: null, message: "Không tìm thấy bộ sưu tập"}
    }
    if (collections.items.length > 0){
        const articles = await Promise.all(
            collections.items.map(async (item) => {
                const article = await Article.findById(item._id).populate("listPhoto");
                const author = await User.findById(article.createdBy);
                
                let representImg = "https://storage.googleapis.com/kltn-hcmute/public/default/default_article.png";
    
                if (article?.listPhoto?.length > 0) {
                  const firstImg = article.listPhoto.find((photo) => photo.type === "img");
                  if (firstImg) {
                    representImg = firstImg.url;
                  }
                }

                return {
                  article: article,
                  updateDate: item.updateDate,
                  representImg: representImg,
                  author: {
                    _id: author._id,
                    displayName: author.displayName
                  }
                };
            })
        );

        return {
            success: true,
            data: {
                ...collections._doc,
                items: articles
            },
            message: "Lấy danh sách thành công"
        }
    }
    return {
        success: true,
        data: collections,
        message: "Không có bài viết"
    };
};

const collectionService = {
    getAll,
    getById,
    createCollection,
    updateCollectionById,
    updateAllCollections,
    deleteCollectionById,
    addNewItem,
    deleteItem,
    getAllArticlebyId,
    changeCollections,
}

export default collectionService;