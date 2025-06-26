import mongoose from 'mongoose';

const { Schema } = mongoose;

const hobbySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now()
  },
  _destroy: {
    type: Number,
    default: null, 
  },
});

const Hobby = mongoose.model('Hobby', hobbySchema);
export default Hobby;
