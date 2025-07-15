# Báo cáo Khóa luận Tốt nghiệp: Mạng xã hội Du lịch tích hợp Công nghệ AI

**TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP. HỒ CHÍ MINH**
**KHOA CÔNG NGHỆ THÔNG TIN**
**BỘ MÔN CÔNG NGHỆ PHẦN MỀM**

---

### **Thông tin nhóm thực hiện**

| Họ và tên         | MSSV     |
| ----------------- | -------- |
| NGUYỄN BẢO QUỐC   | 21110741 |
| PHAN MINH QUÂN    | 21110740 |
| VŨ HOÀNG GIA BẢO  | 21110378 |

**Giảng viên hướng dẫn:** TS. PHAN THỊ HUYỀN TRANG

---

## 📖 Giới thiệu dự án

Trong bối cảnh ngành du lịch Việt Nam đang phục hồi mạnh mẽ, dự án **"Xây dựng Mạng xã hội Du lịch tích hợp Công nghệ AI"** ra đời nhằm đáp ứng nhu cầu kết nối, chia sẻ và trải nghiệm du lịch một cách cá nhân hóa. Ứng dụng hướng đến việc xây dựng một nền tảng nơi người dùng có thể chia sẻ trải nghiệm, khám phá các điểm đến và nhận được những gợi ý du lịch phù hợp với sở thích cá nhân.

Mục tiêu chính là tạo ra một mạng xã hội an toàn, hiệu quả, tích hợp các mô hình AI để nâng cao trải nghiệm người dùng, từ đó góp phần thúc đẩy sự phát triển của du lịch Việt Nam.

---

## ✨ Tính năng chính

Ứng dụng được phát triển với đầy đủ các chức năng của một mạng xã hội du lịch hiện đại:

* **Xác thực và Quản lý người dùng:**
    * Đăng ký (yêu cầu CCCD), đăng nhập, quên mật khẩu, đăng xuất.
    * Quản lý và cập nhật hồ sơ cá nhân.

* **Quản lý nội dung và Tương tác xã hội:**
    * Đăng, xem, tìm kiếm, chỉnh sửa và xóa bài viết/reels.
    * Tương tác với bài viết: Thích, bình luận, chia sẻ.
    * **AI kiểm duyệt nội dung:** Tự động lọc các bài viết/bình luận chứa nội dung (văn bản và hình ảnh) nhạy cảm hoặc không liên quan đến du lịch.

* **Kết nối cộng đồng:**
    * Nhắn tin trực tiếp giữa các người dùng.
    * Quản lý bạn bè và tạo/tham gia các nhóm du lịch theo sở thích.
    * **Chatbot AI (Gemini):** Hỗ trợ trả lời các câu hỏi liên quan đến việc sử dụng ứng dụng.

* **Khám phá du lịch và Tích hợp AI:**
    * **Trang du lịch:** Mỗi địa điểm có một trang riêng với thông tin chi tiết, bài viết và hình ảnh.
    * **Hệ thống gợi ý:** Gợi ý bài viết, trang du lịch dựa trên thuật toán Content-Based Filtering và Collaborative Filtering.
    * **Đề xuất lộ trình:** AI tự động đề xuất lộ trình du lịch tối ưu dựa trên danh sách các điểm đến người dùng đã chọn.
    * **Tiện ích:** Tích hợp bản đồ chỉ đường và thông tin thời tiết theo thời gian thực tại các địa điểm.

---

## 🚀 Công nghệ sử dụng

Dự án được xây dựng dựa trên MERN Stack và tích hợp các mô hình AI tiên tiến:

* **Backend:**
    * **Node.js:** Môi trường thực thi JavaScript phía máy chủ.
    * **Express.js:** Web framework xây dựng các RESTful API nhanh chóng và hiệu quả.
    * **MongoDB:** Cơ sở dữ liệu NoSQL để lưu trữ dữ liệu người dùng, bài viết, v.v. một cách linh hoạt.
    * **JSON Web Token (JWT):** Sử dụng để xác thực và bảo mật cho người dùng.

* **Frontend (Mobile):**
    * **React Native:** Framework phát triển ứng dụng di động đa nền tảng (iOS & Android) từ một mã nguồn duy nhất.
    * **TypeScript:** Đảm bảo mã nguồn ổn định, dễ bảo trì và giảm thiểu lỗi.
    * **Expo Go:** Công cụ để chạy và kiểm thử ứng dụng trên thiết bị di động.

* **Mô hình Trí tuệ nhân tạo (AI):**
    * **Kiểm duyệt nội dung (Text):** Sử dụng **LSTM** và **FastText** để nhận diện từ ngữ nhạy cảm trong văn bản tiếng Việt.
    * **Kiểm duyệt nội dung (Image):** Sử dụng **Google Cloud Vision API** để nhận diện hình ảnh có nội dung không phù hợp.
    * **Hệ thống gợi ý:** Kết hợp **Content-Based Filtering** và **Collaborative Filtering** để đề xuất bài viết và trang du lịch.
    * **Phân loại chủ đề bài viết:** Sử dụng **PhoBERT** (cho văn bản) và **Google Cloud Vision API** (cho hình ảnh) để tự động gán nhãn chủ đề cho bài viết.
    * **Chatbot:** Tích hợp **AI Gemini** (Gemini-1.5-flash) để hỗ trợ người dùng.

---

## 🛠️ Hướng dẫn cài đặt

Để chạy dự án, bạn cần cài đặt các công cụ sau:

* Node.js và npm
* Visual Studio Code
* MongoDB
* Ứng dụng Expo Go trên điện thoại di động

**Các bước cài đặt:**

1.  **Clone mã nguồn từ GitHub:**
    ```bash
    # Clone Backend
    git clone [https://github.com/MquanImart/backend-tlcn](https://github.com/MquanImart/backend-tlcn)

    # Clone Frontend
    git clone [https://github.com/MquanImart/frontend-tlcn](https://github.com/MquanImart/frontend-tlcn)
    ```

2.  **Khởi chạy Backend:**
    ```bash
    cd backend-tlcn
    npm install
    npm start
    ```

3.  **Khởi chạy Frontend:**
    ```bash
    cd frontend-tlcn
    npm install
    npm start
    ```

4.  **Chạy ứng dụng trên điện thoại:**
    * Mở ứng dụng Expo Go.
    * Quét mã QR được hiển thị trong cửa sổ terminal sau khi chạy `npm start` ở bước 3.

---

## ✅ Kết quả đạt được

* **Sản phẩm:** Xây dựng thành công một ứng dụng mạng xã hội du lịch hoàn chỉnh, tích hợp hiệu quả các công nghệ AI để cá nhân hóa trải nghiệm người dùng.
* **Kiến thức:** Nắm vững kiến thức về MERN Stack, quy trình phát triển ứng dụng full-stack, và cách vận dụng các mô hình AI vào một dự án thực tế.
* **Giao diện:** Thiết kế giao diện thân thiện, hoạt động tốt trên cả hai nền tảng Android và iOS.

### **Ưu điểm**
* Giao diện thân thiện, dễ sử dụng.
* Sử dụng ngăn xếp công nghệ hiện đại, đảm bảo hiệu suất và khả năng mở rộng.
* Chức năng nghiệp vụ được hoàn thiện và hoạt động mượt mà.

### **Nhược điểm**
* Còn thiếu các chức năng nâng cao như gợi ý thông minh, phân tích dữ liệu.
* Hiệu suất cần được tối ưu thêm cho các trường hợp tải cao.

