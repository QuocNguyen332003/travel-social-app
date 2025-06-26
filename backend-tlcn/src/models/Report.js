import mongoose from 'mongoose';
import User from './User.js';

const { Schema } = mongoose;

const reportSchema = new Schema({
  _idReporter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  reportDate: {
    type: Number,
    default: () => Date.now(), 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending',
  },
  _destroy: {
    type: Number,
    default: null, 
  },
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
