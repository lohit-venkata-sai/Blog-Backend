import mongoose, { Schema } from 'mongoose'
import { User } from './user.model.js'
import { Comments } from './comments.model.js'
import { Blog } from './blog.model.js'

export const Likes = mongoose.model('Likes', new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    likedBlogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Blog,
    },
    likedCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Comments
    },
}, { timestamps: true }))