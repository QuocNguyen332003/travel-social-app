import mongoose from 'mongoose';

const { Schema } = mongoose;

const TouristDestinationSchema = new Schema({
  name: { type: String, required: true },
  pageId: {
    type: Schema.Types.ObjectId,
    ref: 'Page', 
  },
  province: { type: String, required: true },
  best_months: [{ 
    type: Number, 
    min: 1, 
    max: 12 
  }],
  tags: [{
    type: String,
    enum: [
      "Nature",
      "Wildlife & Creatures",
      "Culture & People",
      "Architecture & Heritage",
      "Accommodation & Services",
      "Food & Drink"
    ],
    required: true,
  }],
  coordinates: {
    type: [Number], // [longitude, latitude]
    validate: {
      validator: function(arr) {
        return arr.length === 2;
      },
      message: 'Coordinates must be an array of [longitude, latitude]'
    },
    required: true,
  }
}, { timestamps: true }); // tự động thêm createdAt, updatedAt

const TouristDestination = mongoose.model('TouristDestination', TouristDestinationSchema);

export default TouristDestination;
