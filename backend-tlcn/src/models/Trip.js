import mongoose from 'mongoose';

const { Schema } = mongoose;

const tripSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  startAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Location', 
    required: true,
  },
  listAddress: [{
    type: Schema.Types.ObjectId,
    ref: 'Location', 
  }],
  endAddress: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Number,
    default: () => Date.now()
  },
  deleteAt: {
    type: Number,
    default: null,
  },
});

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
