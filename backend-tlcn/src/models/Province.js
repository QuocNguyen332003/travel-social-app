import mongoose, { Schema } from 'mongoose';

const ProvinceSchema = new Schema({
  name: { type: String, required: true },
  avt: { type: String, required: true },
  listPage: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Page', 
    default: [] 
  }],
});

const Province = mongoose.model('Province', ProvinceSchema);
export default Province;
