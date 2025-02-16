import mongoose, { Schema } from 'mongoose'


export const Comments = mongoose.model("Comments", new Schema({}, { timestamps: true }))