import jwt from 'jsonwebtoken'
import { env } from '../config/environment.js' // Tệp chứa JWT_SECRET hoặc các config khác

// Middleware để xác thực token
export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] // Lấy token từ header 'Authorization'
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Vui lòng đăng nhập để tiếp tục.' })
  }

  try {
    // Xác thực token với secret key
    const decoded = jwt.verify(token, env.JWT_SECRET)
    req.user = decoded // Lưu thông tin giải mã của token vào req.user
    next() // Cho phép request tiếp tục
  } catch (error) {
    return res.status(403).json({ message: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.' })
  }
}

// Middleware để kiểm tra quyền admin
export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, env.JWT_SECRET)

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập vào tài nguyên này.' })
    }

    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Không thể xác thực người dùng.' })
  }
}