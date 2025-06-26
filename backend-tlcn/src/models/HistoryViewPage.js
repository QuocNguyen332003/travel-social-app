import mongoose from 'mongoose';
const { Schema } = mongoose;

const historyViewPageSchema = new Schema({
  idUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  idPage: { type: Schema.Types.ObjectId, ref: 'Page', required: true },
  viewDate: {
    type: Number,
    default: () => Date.now(),
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  }
});

const HistoryViewPage = mongoose.model('HistoryViewPage', historyViewPageSchema);
export default HistoryViewPage;
