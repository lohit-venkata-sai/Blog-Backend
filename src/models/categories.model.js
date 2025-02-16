import mongoose, { Schema } from 'mongoose'

export const Categories = mongoose.model('Categories', new Schema({}, { timestamps: true }));