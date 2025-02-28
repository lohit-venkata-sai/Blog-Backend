import { Blog } from "../models/blog.model.js";
import { Comments } from "../models/comments.model.js";
import { Likes } from "../models/likes.model.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";

const likeAndDislikeBlog = async (req, res, next) => {
    try {
        const blogSlug = req.params.slug;
        const blog = await Blog.findOne({ slug: blogSlug });

        if (!blog) {
            return next(new ApiError([], 'invalid slug', 404));
        }

        const likedOne = await Likes.findOne({ $and: [{ userId: req.user._id }, { likedBlogId: blog._id }] })
        if (likedOne) {
            await Likes.findByIdAndDelete(likedOne._id);
            return res.status(200).json(new ApiResponse('removed from liked list', {}, 200, true));
        }
        else {
            const liked = new Likes({
                userId: req.user._id,
                likedBlogId: blog._id,
            })
            await liked.save();
            return res
                .status(200)
                .json(new ApiResponse('added to liked list', {}, 200, true));
        }


    } catch (error) {
        return next(new ApiError([error.message], 'error at liked blog'))
    }
}

const likeAndDislikeComment = async (req, res, next) => {
    try {
        const comment = await Comments.findById(req.params.slug);

        if (!comment) {
            return next(new ApiError([], 'invalid slug'))
        }

        const likedComment = await Likes.findOne({ $and: [{ likedCommentId: comment._id }, { userId: req.user._id }] });

        if (likedComment) {
            await Likes.findByIdAndDelete(likedComment._id);
            return res.status(200).json(new ApiResponse('disliked comment', {}, 200, true));
        }
        else {
            const liked = new Likes({
                userId: req.user._id,
                likedCommentId: comment._id,
            })
            await liked.save();
            return res
                .status(200)
                .json(new ApiResponse('liked comment', {}, 200, true));
        }
    } catch (error) {
        return next(new ApiError([error.message], 'error at like and dislike comment'))
    }
}

export { likeAndDislikeBlog, likeAndDislikeComment }