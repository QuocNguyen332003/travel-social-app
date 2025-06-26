import mongoose, { Schema } from 'mongoose';

const AddFriendSchema = new Schema(
  {
    senderId: { 
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: { 
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
    },
    message: { type: String, required: false },
    createdAt: { type: Number, default: () => Date.now() },
    acceptedAt: { type: Number, required: false },
  }
);

const AddFriend = mongoose.model('AddFriend', AddFriendSchema);
export default AddFriend;