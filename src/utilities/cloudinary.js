import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = async (localFilePath) => {
    try {
        const res = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' })
        return res;
    } catch (error) {
        console.log('error at uploading to cloudinary ', error);
        throw error;
    }
}