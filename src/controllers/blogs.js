import { Blog } from '../models/blog.model.js'
import { ApiError } from '../utilities/ApiError.js';
import { deleteFromCloudinary, uploadToCloudinary } from '../utilities/cloudinary.js';
import { ApiResponse } from '../utilities/ApiResponse.js';
import { Likes } from '../models/likes.model.js';
import mongoose from 'mongoose';
import { Comments } from '../models/comments.model.js';


//create blog

const createBlog = async (req, res, next) => {
    try {
        console.log('create blog route is hitted');
        const { title, content, tags } = req.body;

        if (title.trim() == '' || content.trim() == '') {
            return next(new ApiError([], 'title or content is required'));
        }
        const parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags || '[]')


        if (parsedTags.some(tag => !tag.trim())) {
            return next(new ApiError([], 'Tags should not be empty'));
        }

        let coverImageUrl = ''
        console.log('this is req.file data', req.file);
        if (req.file?.path) {
            console.log('file is uploding to cloudinary', req.file.path);

            const result = await uploadToCloudinary(req.file.path);
            coverImageUrl = result.url;
        }


        console.log(coverImageUrl);
        const createdBlog = await Blog.create({
            title,
            content,
            tags: parsedTags,
            coverImage: coverImageUrl,
            author: req?.user?._id,
        })
        if (!await Blog.findById(createdBlog?._id).select('slug')) {
            return next(new ApiError([], 'error at blog collection creation'));
        }

        return res.status(200).json(new ApiResponse('blog posted successfully', createBlog, 200, true));
    } catch (error) {
        // if (req.file?.path) {
        //     fs.unlinkSync(req.coverImage?.[0]?.path);
        // }
        return next(new ApiError([error.message], 'error at blog creation'))
    }

}
const getBlogBySlug = async (req, res, next) => {
    // console.log('route hitted');
    try {
        const slug = req.params.slug
        const blog = await Blog.findOne({ slug })
        console.log({ ...blog });
        if (!blog) {
            return next(new ApiError([], 'blog not found', 404));
        }
        blog.views += 1
        await blog.save();

        //get comments where blogId == blod._id
        //send them as blog +comments using aggregation 
        // const blogWithComments = await Blog.aggregate([{
        //     $match: {
        //         _id: blog._id,
        //     }
        // },
        // {
        //     $lookup: {
        //         from: 'comments',
        //         localField: '_id',
        //         foreignField: 'blogId',
        //         as: 'comments'
        //     },
        // },
        // {
        //     $addFields: {
        //         commentsCount: {
        //             $size: '$comments'
        //         }
        //     }
        // }
        // ])
        // const blogWithLikes = await Blog.aggregate([
        //     {}
        // ])
        console.log("blog._id:", blog._id, typeof blog._id);
        const likes = await Likes.aggregate([
            {
                $match: {
                    likedBlogId: blog._id,
                }
            },
            {
                $count: 'likes'
            }
        ]);
        const comments = await Comments.aggregate([{
            $match: {
                blogId: blog._id
            }
        }
        ]);

        res.status(200).json(new ApiResponse('blog fetched successfully', { ...blog.toObject(), likes: likes[0].likes, comments, totalComments: comments.length }, 200, true));

    } catch (error) {
        return next(new ApiError([error.message], 'error at getBlogBySlug'));
    }
}
const latestBlogs = async (req, res, next) => {
    try {
        console.log('route hitted at latest blogs');
        const slug = Number(req.params.slug);
        if (isNaN(slug) || slug < 0) {
            return next(new ApiError([], 'invalid slug'));
        }
        const blogs = await Blog.find().sort({ createdAt: -1 }).limit(slug);
        console.log(blogs)
        return res.status(200).json(new ApiResponse(`top ${blogs.length}`, blogs, 200, true));

    } catch (error) {
        return next(new ApiError([error.message], 'error at latest blogs'));
    }
}

export { createBlog, getBlogBySlug, latestBlogs };