import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from '../utilities/ApiError.js';
import bcryptjs from "bcryptjs";
import { User } from '../models/user.model.js'
import { deleteFromCloudinary, uploadToCloudinary } from "../utilities/cloudinary.js";
import fs from 'fs'
import { genRefreshAndAccessToken } from "../utilities/jwtTokenGen.js";
import { Likes } from "../models/likes.model.js";


const registerUser = async (req, res, next) => {
    console.log('registration end point hit');
    try {
        const { firstName, lastName, userId, email, password, bio } = req.body;
        console.log(req.body);
        // console.log(req.files);

        //verification
        for (const item of [firstName, lastName, userId, email, password, bio]) {
            if (!item || item.trim() === '') {
                if (req.files?.avatar?.[0]?.path) {
                    fs.unlinkSync(req.files?.avatar?.[0]?.path)
                }
                if (req.files?.banner?.[0]?.path) {
                    fs.unlinkSync(req.files?.banner?.[0]?.path)
                }
                return next(new ApiError([], 'All fields are required', 400))
            }
        }
        if (await User.findOne({ $or: [{ userId }, { email }] })) {
            if (req.files?.avatar?.[0]?.path) {
                fs.unlinkSync(req.files?.avatar?.[0]?.path)
            }
            if (req.files?.banner?.[0]?.path) {
                fs.unlinkSync(req.files?.banner?.[0]?.path)
            }
            return next(new ApiError([], 'User_Id or Email already exists in our database', 409))
        }
        //check password length
        if (password.length < 4) {
            if (req.files?.avatar?.[0]?.path) {
                fs.unlinkSync(req.files?.avatar?.[0]?.path)
            }
            if (req.files?.banner?.[0]?.path) {
                fs.unlinkSync(req.files?.banner?.[0]?.path)
            }
            return next(ApiError([], 'Password should contain atleast 4 characters', 400));
        }

        //hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);


        //upload to cluodinary
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


const userLogin = async (req, res, next) => {
    try {
        const { userId, email, password } = req.body;

        //verification
        if (!(userId || email) || !password || userId?.trim() === '' || email?.trim() === '' || password.trim() === '') {
            return next(new ApiError([], 'All fields are required', 400))
        }

        const user = await User.findOne({ $or: [{ userId }, { email }] });
        if (!user) {
            return next(new ApiError([], 'user doest exits'));
        }
        if (await bcryptjs.compare(password, user?.password)) {
            console.log('user logged in successfully');
        }
        else {
            return next(new ApiError([], 'invalid password'));
        }

        const { accessToken, refreshToken } = await genRefreshAndAccessToken(res, user);
        return res.status(200).json(new ApiResponse('login successful', {
            accessToken,
            refreshToken
        }, 200, true))
    } catch (error) {
        return next(new ApiError([error], error.message, 500));
    }
}

const userLogout = async (req, res, next) => {

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $set: {
                refreshToken: null
            }
        }, { new: true })
        // Clear cookies and send response
        res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });

        console.log('log out successfull')
        return res.status(200).json(new ApiResponse('user logout successsful', [], 200, true));
    } catch (error) {
        return next(new ApiError([error], error.message, 500));
    }
}

const userEditPassword = async (req, res, next) => {
    try {
        console.log('hitted userEditPassword route', req?.user._id)
        const user = await User.findById(req?.user._id);
        if (!user) {
            return next(new ApiError([], 'user doest exists'))
        }
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword.trim() || !newPassword.trim()) { next(new ApiError([], "fields should not be empty")) }
        if (await bcryptjs.compare(oldPassword, user?.password)) {
            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json(new ApiResponse('password updated', {}, 200, true));
        }
        else {
            return next(new ApiError([], 'invalid old password'));
        }
    } catch (error) {
        return next(new ApiError([error.message], 'error at users edit password router'))
    }

}

const getUserInfo = async (req, res, next) => {
    try {
        const user = await User.findById(req?.user._id).select('-password -accessToken');
        return res.status(200).json(new ApiResponse('user data fetching successfull', user, 200, true));
    } catch (error) {
        return next(new ApiError([], 'error at get user details route'));
    }
}

const userProfile = async (req, res, next) => {
    console.log(req.params.id);

    try {
        const user = await User.findOne({ userId: req.params?.id.trim().toLowerCase() }).select('-password -refreshToken');
        console.log(user);
        if (!user) {
            return next(new ApiError([], 'user not found', 404))
        }
        return res.status(200).json(new ApiResponse('user found', user, 200, true))
    } catch (error) {
        return next(new ApiError([], 'error at userProfile'))
    }
}

const getLikedBlogs = async (req, res, next) => {
    //get user id 
    console.log('getLikedBlogs is hitted')
    const likedBlogs = await Likes.aggregate([
        {
            $match: { userId: req.user._id }
        },
        {
            $lookup: {
                from: "blogs",
                localField: "likedBlogId",
                foreignField: "_id",
                as: "likedBlogs"
            }
        },
        {
            $unwind: "$likedBlogs"
        },
        {
            $project: {
                _id: 0,
                "likedBlogs._id": 1,
                "likedBlogs.title": 1,
                "likedBlogs.tags": 1,
                "likedBlogs.coverImage": 1,
                "likedBlogs.views": 1,
                "likedBlogs.slug": 1
            }
        },
        {
            $group: {
                _id: null,
                likedBlogs: { $push: "$likedBlogs" }
            }
        },
        {
            $project: { _id: 0 }
        }
    ]);


    return res.status(200).json(new ApiResponse('all ok ', likedBlogs, 200, true))
}

export { registerUser, userLogin, userLogout, userEditPassword, getUserInfo, userProfile, getLikedBlogs }