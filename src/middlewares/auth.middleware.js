import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utilities/ApiError.js';

const authMiddleware = async (req, _, next) => {
    console.log('hitted auth middleware')
    const token = req.cookies.accessToken || req.header('Authorization')?.replace('Bearer ', '').trim();
    if (!token) {
        return next(new ApiError([], 'invalid or expired access token', 400));
    }
    try {
        const decodedAccessToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedAccessToken._id).select("-password -refreshToken");

        if (!user) {
            return next(new ApiError([], 'invalid access token', 401));
        }
        req.user = user;
    } catch (error) {
        return next(new ApiError([], 'invalid authentication', 400));
    }

    next();
};

export { authMiddleware }