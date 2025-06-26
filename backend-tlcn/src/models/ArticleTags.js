import mongoose, { Schema, Types } from 'mongoose';

const ImageTagSchema = new Schema({
  tag: { type: String, required: true },
  weight: { type: Number, required: true }
}, { _id: false });

const ArticleTagsSchema = new Schema({
  idArticle: {
    type: Types.ObjectId,
    required: true,
    ref: 'Article'
  },
  textTag: {
    type: [String],
    enum: [
      "Nature",
      "Wildlife & Creatures",
      "Culture & People",
      "Architecture & Heritage",
      "Accommodation & Services",
      "Food & Drink"
    ],
    required: true,
  },
  imagesTag: {
    type: [ImageTagSchema],
    default: []
  },
  createdAt: {
    type: Number,
    default: () => Date.now()
  },
  updatedAt: {
    type: Number,
    default: () => Date.now()
  }
});

const ArticleTags = mongoose.model('ArticleTags', ArticleTagsSchema);
export default ArticleTags;
