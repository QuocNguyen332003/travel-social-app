import mongoose from 'mongoose';

const { Schema } = mongoose;

const identificationSchema = new Schema({
  number: { type: String, required: true, unique: true }, 
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  sex: { type: String, required: true },
  nationality: { type: String },
  placeOfOrigin: { type: String },
  placeOfResidence: { type: String },
  dateOfExpiry: { type: String, required: true },
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
    default: null, // Hỗ trợ soft delete
  },
});

const Identification = mongoose.model('Identification', identificationSchema);
export default Identification;
