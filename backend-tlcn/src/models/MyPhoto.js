import mongoose from 'mongoose';


const { Schema } = mongoose;

const myPhotoSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  idAuthor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['img', 'video', 'record'],
    required: true,
  },
  url: {
    type: String,
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

const MyPhoto = mongoose.model('MyPhoto', myPhotoSchema);
export default MyPhoto;
