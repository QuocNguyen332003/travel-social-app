import { Storage } from '@google-cloud/storage'
import fs from 'fs';
import { env } from './environment.js';

// Khởi tạo Google Cloud Storage
const storage = new Storage();

const bucket = storage.bucket(env.BUCKET_NAME);

const uploadImageBufferToStorage = async (buffer, destination, mimetype) => {
  try {
    const file = bucket.file(destination);

    const stream = file.createWriteStream({
      metadata: {
        contentType: mimetype,
        cacheControl: "no-cache, no-store, must-revalidate",
        metadata: {
          cacheBuster: Date.now(),
        },
      },
    });

    stream.end(buffer);

    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    const fileUrl = `https://storage.googleapis.com/${env.BUCKET_NAME}/${destination}?t=${Date.now()}`;
    return fileUrl;
  } catch (error) {
    console.error("❌ Lỗi khi upload file lên GCS:", error);
    throw error;
  }
};
  

const deleteImageFromStorage = async (fileName) => {
    try {
      await bucket.file(fileName).delete();

    } catch (error) {
      if (error.code === 404) {
        console.error("File không tồn tại!");
      } else {
        console.error("Lỗi khi xóa file:", error);
      }
      throw error;
    }
};


export const cloudStorageService = {
    uploadImageBufferToStorage,
    deleteImageFromStorage
}
  
  