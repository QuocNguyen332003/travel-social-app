import mongoose from 'mongoose';
// Assuming User, Group, Article, Comment models will be imported or defined elsewhere
// import User from './User.js'; // Already imported
// import Group from './Group.js';
// import Article from './Article.js';   // <--- Ensure you have an 'Article' model
// import Comment from './Comment.js';


const { Schema } = mongoose;

const notificationSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['read', 'unread'], 
    default: 'unread', 
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    default: null,
  },
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'Article', 
    default: null,
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  pageId: {
    type: Schema.Types.ObjectId,
    ref: 'Page',
    default: null,
  },
  reelId: {
    type: Schema.Types.ObjectId,
    ref: 'Reel',
    default: null,
  },
  relatedEntityType: {
    type: String,
    enum: ['Group', 'Article', 'Comment', 'User', 'Page', 'Reel', null], 
    default: null,
  },
  readAt: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  _destroy: {
    type: Number,
    default: null,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;