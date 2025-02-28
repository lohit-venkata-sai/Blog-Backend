import mongoose, { Schema } from 'mongoose'
import slugify from 'slugify'

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: String,
        }
    ],
    coverImage: {
        type: String,
        required: false,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slug: {
        type: String,
        lowercase: true,
        trim: true,
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true })


BlogSchema.pre('save', async function (next) {

    if (!this.isModified("title")) return next();


    let slug = slugify(this.title, {
        replacement: '_',
        strict: true,
        lower: true,
        trim: true,
    })
    let uniqueSlug = slug
    let counter = 1;
    while (await mongoose.model('Blog').exists({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    this.slug = uniqueSlug;
    next();
})

export const Blog = mongoose.model('Blog', BlogSchema)

