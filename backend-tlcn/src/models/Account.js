import mongoose from 'mongoose'

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    //required: true,
    //unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  createdAt: { type: Number, default: () => Date.now() },
  updatedAt: { type: Number, default: () => Date.now() },
  _destroy: {
    type: Number,
    default: null,
  },
}) 

const Account = mongoose.model('Account', accountSchema)
export default Account
