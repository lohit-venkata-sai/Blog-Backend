import mongoose, { Schema } from 'mongoose'

export const User = mongoose.model("User", new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    banner: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    accessToken: {
        type: String,
    },
}, { timestamps: true }))