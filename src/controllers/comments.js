import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { Blog } from "../models/blog.model.js";
import { Comments } from "../models/comments.model.js";

const postComment = async (req, res, next) => { //content, blog_Id, comment posted by user_id
    try {
        console.log('post comment route hit');
        const { content } = req.body;
        console.log(content);
        const slug = req.params.slug;
        if (content?.trim() === '') {
            return next(new ApiError([], 'content should not be empty'));
        }

        const blog = await Blog.findOne({ slug });
        if (!blog) {
            return next(new ApiError([], 'invalid blog id'));
        }

        const newComment = await Comments.create({
            userId: req.user?._id,
            blogId: blog._id,
            content,
        })

        if (!newComment) {
            return next(new ApiError([], 'comment cant be added'));
        }

        res.status(200).json(new ApiResponse('comment added successfully', newComment, 200, true));

    } catch (error) {
        return next(new ApiError([error.message], 'error at posting comment '));
    }
}

export { postComment }