import mongoose, { Schema } from 'mongoose'


export const Blog = mongoose.model('Blog', new Schema({}, { timestamps: true }))