import { accountService } from '../services/accountService.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Dùng để tạo mã OTP ngẫu nhiên
import twilio from 'twilio'; // Thêm Twilio vào để gửi SMS
import nodemailer from 'nodemailer';
import Account from "../models/Account.js";
import User from "../models/User.js";
dotenv.config()

const getAccounts = async (req, res) => {
  try {
    const { filter, page, limit } = req.query; 

    const result = await accountService.getAccounts({
      filter,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10, 
    });

    res.status(200).json({
      success: true,
      data: result.accounts,
      pagination: {
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        totalAccounts: result.totalAccounts,
        limit: limit ? parseInt(limit, 10) : 10,
      },
      message: 'Lấy danh sách tài khoản thành công',
    });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message });
  }
};

const getAccountById = async (req, res) => {
  try {
    const account = await accountService.getAccountById(req.params.id)
    if (!account) return res.status(404).json({ success: false, data: null, message: 'Tài khoản không tồn tại' })
    res.status(200).json({ success: true, data: account, message: 'Lấy tài khoản thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const createAccount = async (req, res) => {
  try {
    const {
      email,
      password,
      displayName,
      hashtag,
      number,
      fullName,
      dateOfBirth,
      sex,
      nationality,
      placeOfOrigin,
      placeOfResidence,
      dateOfExpiry,
      province,
      district,
      ward,
      street,
      placeName,
      lat,
      long,
    } = req.body;

    const { newAccount, newUser } = await accountService.createAccount({
      email,
      password,
      displayName,
      hashtag,
      number,
      fullName,
      dateOfBirth,
      sex,
      nationality,
      placeOfOrigin,
      placeOfResidence,
      dateOfExpiry,
      province,
      district,
      ward,
      street,
      placeName,
      lat,
      long,
    });

    return res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công!",
      account: newAccount,
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Lỗi tạo tài khoản:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Lỗi hệ thống, vui lòng thử lại.",
    });
  }
};

const updateAccountById = async (req, res) => {
  try {
    const updatedAccount = await accountService.updateAccountById(req.params.id, req.body)
    if (!updatedAccount) return res.status(404).json({ success: false, data: null, message: 'Tài khoản không tồn tại' })
    res.status(200).json({ success: true, data: updatedAccount, message: 'Cập nhật tài khoản thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const updateAllAccounts = async (req, res) => {
  try {
    const updatedAccounts = await accountService.updateAllAccounts(req.body)
    res.status(200).json({ success: true, data: updatedAccounts, message: 'Cập nhật tất cả tài khoản thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}

const deleteAccountById = async (req, res) => {
  try {
    const deletedAccount = await accountService.deleteAccountById(req.params.id)
    if (!deletedAccount) return res.status(404).json({ success: false, data: null, message: 'Tài khoản không tồn tại' })
    res.status(200).json({ success: true, data: null, message: 'Xóa tài khoản thành công' })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}
const loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' })}
    const loginResult = await accountService.loginAccount(email, password) 
    if (!loginResult.success) 
      {
        return res.status(401).json({ success: false, message: loginResult.message })
    }
    res.status(200).json({success: true,data: loginResult.data,message: 'Đăng nhập thành công'
    })
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: error.message })
  }
}
const sendOtp = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {return res.status(400).json({ success: false, message: "Vui lòng nhập email của bạn." });}
    const sendOtpResult = await accountService.sendOtp(input);
    if (!sendOtpResult.success) {return res.status(sendOtpResult.status || 400).json({ success: false, message: sendOtpResult.message });}
    return res.status(200).json({success: true,message: "Mã OTP đã được gửi đến email của bạn."});

  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi máy chủ. Vui lòng thử lại." });
  }
};
const verifyOtp = async (req, res) => {
  try {
    const { input, otp } = req.body; // Lấy input và otp từ request body
    const storedOtp = await accountService.getOtp(input);
    if (!storedOtp) { return res.status(400).json({ success: false, message: "OTP đã hết hạn hoặc không tồn tại." });}
    // Kiểm tra OTP có khớp không
    if (storedOtp !== otp) {return res.status(400).json({ success: false, message: "Mã OTP không chính xác." });}
    // Xóa OTP sau khi xác minh thành công (tránh dùng lại)
    await accountService.deleteOtp(input);
    return res.status(200).json({ success: true, message: "Xác minh OTP thành công!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi máy chủ, vui lòng thử lại." });
  }
};
const updatePassword = async (req, res) => {
  try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {return res.status(400).json({ success: false, message: "Vui lòng cung cấp email và mật khẩu mới." });}
      const account = await accountService.getAccountByEmail(email);
      if (!account) {return res.status(404).json({ success: false, message: "Email không tồn tại trong hệ thống." });}
      await accountService.updatePassword(email, newPassword);
      return res.status(200).json({ success: true, message: "Mật khẩu đã được cập nhật thành công." });
  } catch (error) {
      return res.status(500).json({ success: false, message: "Lỗi hệ thống, vui lòng thử lại." });
  }
};
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email là trường bắt buộc",
      });
    }

    // Kiểm tra định dạng email
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      return res.status(400).json({
        success: false,
        message: "Định dạng email không hợp lệ",
      });
    }

    // Gọi service để kiểm tra email
    const result = await accountService.checkEmail(email);

    return res.status(200).json({
      success: true,
      exists: result.exists,
      message: result.message,
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra email:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi kiểm tra email",
    });
  }
};
const checkHashtag = async (req, res) => {
  try {
    const { hashtag } = req.body;

    // Validate input
    if (!hashtag) {
      return res.status(400).json({
        success: false,
        message: "Hashtag là trường bắt buộc",
      });
    }
    // Gọi service để kiểm tra hashtag
    const result = await accountService.checkHashtag(hashtag);

    return res.status(200).json({
      success: true,
      exists: result.exists,
      message: result.message,
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra hashtag:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi kiểm tra hashtag",
    });
  }
};
const comparePassword = async (req, res) => {
  try {
    const { idAccount, password } = req.body;

    // Validate input
    if (!idAccount || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp ID tài khoản và mật khẩu",
      });
    }

    // Gọi service để lấy tài khoản theo ID
    const account = await accountService.getAccountById(idAccount);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await accountService.comparePassword(password, account.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu không đúng",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mật khẩu hợp lệ",
    });
  } catch (error) {
    console.error("Lỗi khi kiểm tra mật khẩu:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống, vui lòng thử lại",
    });
  }
};

const logOut = async (req, res) => {
  try {
    const result = await accountService.logOut(req.body.userId);
    if (result) {
      return res.status(200).json({
      success: true,
      message: "Đăng xuất thành công",
    });
    }
    return res.status(400).json({
      success: true,
      message: "Đăng xuất thất bại",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống, vui lòng thử lại",
    });
  }
};

export const accountController = {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccountById,
  updateAllAccounts,
  deleteAccountById,
  loginAccount,
  sendOtp,
  verifyOtp,
  updatePassword,
  checkEmail,
  checkHashtag,
  comparePassword,
  logOut
}
