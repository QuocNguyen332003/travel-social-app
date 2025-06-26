
// const refreshTokenService = async (refreshToken) => {
//   try {
//     if (!refreshToken) {
//       return {
//         success: false,
//         message: MESSAGES.REFRESH_TOKEN.MISSING_TOKEN, // Sử dụng thông điệp từ MESSAGES
//       };
//     }

//     // Tìm user dựa trên refreshToken
//     const user = await User.findOne({ refreshToken: refreshToken });
//     if (!user) {
//       return {
//         success: false,
//         message: MESSAGES.REFRESH_TOKEN.INVALID_TOKEN,
//       };
//     }
//     if (!user.status) {
//       return { success: false, message: MESSAGES.LOGIN.ACCOUNT_LOCKED };
//     }

//     // Xác thực refreshToken
//     return new Promise((resolve, reject) => {
//       jwt.verify(refreshToken, env.JWT_REFRESH_KEY, (err, decoded) => {
//         if (err) {
//           return resolve({
//             success: false,
//             message: MESSAGES.REFRESH_TOKEN.EXPIRED_TOKEN,
//           });
//         }

//         // Tạo Access Token mới
//         const newAccessToken = jwt.sign(
//             { id: user._id, email: user.email, role: user.role },
//             env.JWT_SECRET,
//             { expiresIn: "2h" }
//         );

//         resolve({
//           success: true,
//           data: {
//             token: newAccessToken,
//             user: { _id: user._id, username: user.username, role: user.role, myTests: user.myTests },
//           },
//           message: MESSAGES.REFRESH_TOKEN.SUCCESS,
//         });
//       });
//     });
//   } catch (error) {
//     return {
//       success: false,
//       message: MESSAGES.REFRESH_TOKEN.ERROR,
//       error: error.message,
//     };
//   }
// };
