import mongoose from 'mongoose';

const { Schema } = mongoose;

const pageSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  avt: {
    type: Schema.Types.ObjectId,
    ref: 'MyPhoto',
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Address',
  },
  follower: [{
    type: Schema.Types.ObjectId,
    ref: 'User', 
  }],
  timeOpen: {
    type: String,
    trim: true,
  },
  timeClose: {
    type: String,
    trim: true,
  },
  listArticle: [{
    type: Schema.Types.ObjectId,
    ref: 'Article', 
  }],
  idCreater: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  listAdmin: [{
    idUser: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    state: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'], 
      required: true,
    },
    joinDate: {
      type: Number,
      default: () => Date.now(),
    },
  }],
  listTicket: [{
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
  }],
  hobbies: [{
    type: Schema.Types.ObjectId,
    ref: 'Hobby', 
  }],
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

const Page = mongoose.model('Page', pageSchema);
export default Page;