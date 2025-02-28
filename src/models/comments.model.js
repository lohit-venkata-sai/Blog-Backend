import mongoose, { Schema } from 'mongoose'
import { Blog } from './blog.model.js'
import { User } from './user.model.js'


export const Comments = mongoose.model("Comments", new Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Blog,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true }))