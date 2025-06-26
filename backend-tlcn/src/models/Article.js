import mongoose from 'mongoose';
import User from './User.js';
import Report from './Report.js';
import Group from './Group.js';
import Address from './Address.js';
import MyPhoto from './MyPhoto.js';
import Comment from './Comment.js';

const { Schema } = mongoose;

const articleSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  reports: [{
    type: Schema.Types.ObjectId,
    ref: 'Report',
  }],
  groupID: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
  },
  hashTag: {
    type: [String],
    default: [],
    validate: {
      validator: function (tags) {
        return tags.every(tag => /^#[a-zA-Z0-9_À-ỹ]+$/.test(tag));
      },
      message: 'Mỗi hashtag phải bắt đầu bằng # và chỉ chứa chữ cái, số hoặc gạch dưới',
    },
  },
  listPhoto: [{
    type: Schema.Types.ObjectId,
    ref: 'MyPhoto', 
  }],
  scope: {
    type: String,
    enum: ["Công khai", "Bạn bè", "Riêng tư"], 
    trim: true,
  },
  emoticons: [{
    type: Schema.Types.ObjectId,
    ref: 'User', 
  }],
  
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  createdAt: {
    type: Number,
    default: () => Date.now()
  },
  updatedAt: {
    type: Number,
    default: () => Date.now()
  },
  _destroy: {
    type: Number,
    default: null, // Hỗ trợ soft delete
  },
});

const Article = mongoose.model('Article', articleSchema);
export default Article;


articleSchema.pre('save', function (next) {
  if (this.hashTag && this.isModified('hashTag')) {
    this.hashTag = this.hashTag
      .map(tag => {
        const cleanedTag = tag
          .replace(/#/g, '') 
          .trim()
          .replace(/[^\w\sÀ-ỹ]/gi, ''); 

        return `#${cleanedTag}`; 
      })
      .filter(tag => tag.length > 1); 
  }
  next();
});