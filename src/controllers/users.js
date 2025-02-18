import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from '../utilities/ApiError.js';
import bcryptjs from "bcryptjs";
import { User } from '../models/user.model.js'
const registerUser = async (req, res, next) => {
    console.log('registration end point hit');
    try {
        const { firstName, lastName, userId, email, password, bio } = req.body;
        console.log(req.body);

        //verification
        for (const item of [firstName, lastName, userId, email, password, bio]) {
            if (!item || item.trim() === '') {
                throw new ApiError([], 'All fields are required');
            }
        }
        if (await User.findOne({ $or: [{ userId }, { email }] })) {
            throw new ApiError([], 'User_Id or Email already exists in our database');
        }
        //check password length
        if (password.length < 4) {
            throw new ApiError([], 'Password should contain atleast 4 characters');
        }

        //hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const createdUser = await User.create({
            firstName,
            lastName,
            userId,
            email,
            password: hashedPassword,
            bio,
        })

        //check if user exists 
        const user = await User.findById(createdUser._id).select("-password -refreshToken");
        if (user) {
            return res.status(200).json(new ApiResponse('user registration successfull', user, 200, true))
        }
        else {
            throw new ApiError([], 'user registration failed');
        }

    } catch (error) {
        console.log('error at registraton user controller', error);
        throw new ApiError([error.message], 'error at registraton user controller');
    }
}

export { registerUser }