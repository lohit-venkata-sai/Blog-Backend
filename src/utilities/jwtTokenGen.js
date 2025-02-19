import jwt from 'jsonwebtoken'
import { ApiError } from './ApiError.js'
import bcryptjs from 'bcryptjs'
const genJwtToken = (payload, secret, expire) => {
    console.log(payload, secret, expire);
    try {
        return jwt.sign(payload, secret, {
            expiresIn: expire,
        });
    } catch (error) {
        throw new ApiError([error], error.message);
    }
}

const genRefreshAndAccessToken = async (res, user) => {
    try {
        //generate access token
        const accessToken = genJwtToken({
            _id: user._id,
            userId: user.userId,
        }, process.env.JWT_ACCESS_TOKEN_SECRET, process.env.JWT_ACCESS_TOKEN_EXPIRY);

        //generate refresn token 
        const refreshToken = genJwtToken({
            _id: user._id,
        }, process.env.JWT_REFRESH_TOKEN_SECRET, process.env.JWT_REFRESH_TOKEN_EXPIRY);

        //save jwt to user cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        user.refreshToken = await bcryptjs.hash(refreshToken, 10);
        await user.save();

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError([], 'error at token generation');
    }

}

export { genRefreshAndAccessToken }