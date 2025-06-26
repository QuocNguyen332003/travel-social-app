import Identification from "../models/Identification.js";
import { env } from "../config/environment.js";
import FormData from 'form-data';
import axios from 'axios';

const getIdentifications = async () => {
  return await Identification.find({ _destroy: null });
};

const getIdentificationById = async (id) => {
  return await Identification.findOne({ _id: id, _destroy: null });
};

const createIdentification = async (imageBuffer) => {
  try {
    const cccdData = await extractCCCDData(imageBuffer);
    const newIdentification = await Identification.create(cccdData);

    return {
      status: 201,
      response: {
        success: true,
        data: newIdentification,
        message: 'Tạo chứng minh thư thành công',
      },
    };
  } catch (error) {
    throw new Error(`Lỗi khi tạo chứng minh thư: ${error.message}`);
  }
};

const updateIdentificationById = async (id, data) => {
  return await Identification.findByIdAndUpdate(id, data, { new: true });
};

const updateAllIdentifications = async (data) => {
  return await Identification.updateMany({}, data, { new: true });
};

const deleteIdentificationById = async (id) => {
  return await Identification.findByIdAndUpdate(id, { _destroy: Date.now() }, { new: true });
};


const extractCCCDData = async (imageBuffer) => {
  try {
    const formData = new FormData();
    formData.append('image', imageBuffer, { filename: 'cccd.jpg' });

    const fptResponse = await axios.post(env.API_ENDPOINT_CCCD, formData, {
      headers: {
        ...formData.getHeaders(),
        'api-key': env.API_KEY_CCCD,
      },
    });

    const responseData = fptResponse.data;

    if (responseData.errorCode !== 0) {
      throw new Error(responseData.errorMessage || 'Lỗi khi gọi API FPT');
    }

    const cccdData = responseData.data[0];

    return {
      number: cccdData.id, 
      fullName: cccdData.name,
      dateOfBirth: cccdData.dob, 
      sex: cccdData.sex === 'NAM' ? 'male' : 'female',
      nationality: cccdData.nationality, 
      placeOfOrigin: cccdData.home,
      placeOfResidence: cccdData.address,
      dateOfExpiry: cccdData.doe,
    };
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.number) {
      throw new Error('Số CCCD này đã được sử dụng');
      
    }
    throw new Error(`Lỗi khi xử lý ảnh CCCD: ${error.message}`);
  }
};

export const identificationService = {
  getIdentifications,
  getIdentificationById,
  createIdentification,
  updateIdentificationById,
  updateAllIdentifications,
  deleteIdentificationById,
  extractCCCDData,
};
