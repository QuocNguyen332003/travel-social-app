import mongoose from 'mongoose'

const locationSchema = new mongoose.Schema({
  displayName: {
    type: String
  },
  placeId: {
    type: String,
    required: false,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number, 
    required: true,
  },
  address: {
    type: String,
    required: true,
  }
}) 

const Location = mongoose.model('Location', locationSchema)
export default Location
