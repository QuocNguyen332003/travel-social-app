import mongoose, { Schema } from 'mongoose';

const ReelsSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  reports: { type: [String], default: [] },
  reports: [{
    type: Schema.Types.ObjectId,
    ref: 'Report',
  }],
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
  photo: {     type: Schema.Types.ObjectId,
    ref: 'MyPhoto',  },
  scope: {     type: String,
    trim: true,},
  emoticons: [{
    type: Schema.Types.ObjectId,
    ref: 'User', 
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  createdAt: { type: Number, required: true, default: () => Date.now() },
  updatedAt: { type: Number, default: () => Date.now() },
  destroyAt: { type: Number, default: null }
});

const Reels = mongoose.model('Reels', ReelsSchema);
export default Reels;
