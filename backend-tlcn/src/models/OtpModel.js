import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    input: { type: String, required: true, unique: true }, // Email hoặc số điện thoại
    otp: { type: String, required: true },
    createdAt: { type: Number, default: () => Date.now(), expires: 300 } // OTP hết hạn sau 5 phút
});

export default mongoose.model("Otp", OtpSchema);
