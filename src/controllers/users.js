import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from '../utilities/ApiError.js';
import bcryptjs from "bcryptjs";
import { User } from '../models/user.model.js'
import { deleteFromCloudinary, uploadToCloudinary } from "../utilities/cloudinary.js";
const registerUser = async (req, res, next) => {
    console.log('registration end point hit');
    try {
        const { firstName, lastName, userId, email, password, bio } = req.body;
        console.log(req.body);
        // console.log(req.files);

        //verification
        for (const item of [firstName, lastName, userId, email, password, bio]) {
            if (!item || item.trim() === '') {
                return next(new ApiError([], 'All fields are required', 400))
            }
        }
        if (await User.findOne({ $or: [{ userId }, { email }] })) {
            return next(new ApiError([], 'User_Id or Email already exists in our database', 409))
        }
        //check password length
        if (password.length < 4) {
            throw new ApiError([], 'Password should contain atleast 4 characters', 400);
        }

        //hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);


        //upload to clodinary
        const avatarPath = req.files?.avatar?.[0]?.path || null;
        const bannerPath = req.files?.banner?.[0]?.path || null;

        let avatarUrl = '';
        let bannerUrl = ''
        if (avatarPath) {
            avatarUrl = await uploadToCloudinary(avatarPath);
            console.log(avatarUrl);

        }
        if (bannerPath) {
            bannerUrl = await uploadToCloudinary(bannerPath);
            console.log(bannerUrl)
        }
        const createdUser = await User.create({
            firstName,
            lastName,
            userId,
            email,
            password: hashedPassword,
            bio,
            avatar: avatarUrl?.url,
            banner: bannerUrl?.url,
        })

        //check if user exists 
        const user = await User.findById(createdUser._id).select("-password -refreshToken");
        if (user) {
            return res.status(200).json(new ApiResponse('user registration successfull', user, 200, true))
        }
        else {
            if (avatarUrl) {
                deleteFromCloudinary(avatarUrl?.public_id)
            }

            if (bannerUrl) {
                deleteFromCloudinary(bannerUrl?.public_id);
            }

            next(new ApiError([], 'user registration failed'));
        }

    } catch (error) {
        console.log('error at registraton user controller', error);
        next(new ApiError([error.message], 'error at registraton user controller'))
    }
}

export { registerUser }