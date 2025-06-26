# Base image
FROM node:22

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Copy file package.json và package-lock.json trước để cache layer npm install
COPY package*.json ./

# Cài dependencies
RUN npm install --production

# Copy toàn bộ source code
COPY . .

# Đảm bảo port 8080 được expose (Cloud Run mặc định dùng PORT 8080)
EXPOSE 8080

# Command khởi chạy ứng dụng
CMD ["node", "./bin/www"]