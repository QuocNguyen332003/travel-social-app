import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    settings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        notifications: { type: Boolean, default: true },
        muteUntil: { type: Number, default: null },
        active: { type: Boolean, default: true, require: true },
        sos: {type: Boolean, default: false}
      },
    ],
    type: { 
      type: String, 
      enum: ["private", "group", "page"], 
      default: "private"
    },
    groupName: { type: String, default: null }, 
    avtGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'MyPhoto', default: null }, 
    pageId: { type: mongoose.Schema.Types.ObjectId, ref: "Page", default: null },
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    createdAt: { type: Number, default: () => Date.now() },
    updatedAt: { type: Number, default: () => Date.now() }
  }
);

// Middleware kiểm tra trước khi lưu
ConversationSchema.pre("save", function (next) {
  if (!this.participants || this.participants.length === 0) {
    return next(new Error("Phải có ít nhất 1 người dùng"));
  }

  // Xác định type dựa vào số lượng participants
  if (this.participants.length === 1) {
    this.type = "page";
  } else if (this.participants.length === 2) {
    this.type = "private";
  } else {
    this.type = "group";
  }

  // Kiểm tra ràng buộc khi type là "page"
  if (this.type === "page") {
    if (!this.pageId) {
      return next(new Error("Phải có id của trang"));
    }
  } else {
    this.pageId = null;
  }

  // Tạo settings mặc định cho từng participant nếu chưa có
  const existingUserIds = this.settings.map((s) => s.userId.toString());
  this.participants.forEach((userId) => {
    if (!existingUserIds.includes(userId.toString())) {
      this.settings.push({
        userId: userId,
        notifications: true,
        muteUntil: null,
      });
    }
  });

  next();
});

const Conversation = mongoose.model('Conversation', ConversationSchema);
export default Conversation;
