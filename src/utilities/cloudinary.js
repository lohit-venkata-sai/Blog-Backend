import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
import Dotenv from 'dotenv';

Dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) { return null }
        const res = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' })

        console.log('file uploaded to cloudinary');
        fs.unlinkSync(localFilePath);
        return res;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log('error at uploading to cloudinary ', error);
        throw error;
    }
}

const deleteFromCloudinary = async (public_id) => {
    try {
        if (!public_id) { return null };
        const res = await cloudinary.uploader.destroy(public_id);
        console.log(`${res.result}`);
    } catch (error) {
        throw new ApiError('error at deleting from cloudinary', error);
    }
}
export { uploadToCloudinary, deleteFromCloudinary }