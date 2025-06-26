import mongoose, { Schema } from 'mongoose';

const CollectionSchema = new Schema(
  {
    name: { type: String, required: true },
    items: [
      {
        _id: { 
          type: Schema.Types.ObjectId, 
          ref: 'Article',
          required: true },
        updateDate: { type: Number, default: () => Date.now() },
      }
    ],
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() },
    _destroy: { type: Number, required: false },
    type: {
      type: String,
      enum: ['article', 'reels'],
      required: true,
    },
  }
);

const Collection = mongoose.model('Collection', CollectionSchema);
export default Collection;