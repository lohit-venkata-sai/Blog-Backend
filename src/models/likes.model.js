import mongoose, { Schema } from 'mongoose'

export const Likes = mongoose.model('Likes', new Schema({}, { timestamps: true }))