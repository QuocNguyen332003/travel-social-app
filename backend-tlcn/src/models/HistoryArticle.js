import mongoose, { Schema, Document } from 'mongoose';

// Define the schema
const HistoryArticleSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  idArticle: { 
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true },
  action: { 
    type: String, 
    enum: ['View', 'Like'], 
    default: 'View'
  },
  viewDate: { 
    type: Number, 
    default: () => Date.now() 
  },
});

// Create and export the model
const HistoryArticle = mongoose.model('HistoryArticle', HistoryArticleSchema);
export default HistoryArticle;