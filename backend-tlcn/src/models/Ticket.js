import mongoose from 'mongoose';

const { Schema } = mongoose;

const ticketSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
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

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
