import { Router } from "express";
import { createBlog, getBlogBySlug } from "../controllers/blogs.js";
import { likeAndDislikeBlog, likeAndDislikeComment } from '../controllers/likes.js'
import { postComment } from "../controllers/comments.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/b/:slug').get(getBlogBySlug);
// router.route('/b/:slug/comment').get(getAllComments);

//secure route 

router.route('/create-blog').post(authMiddleware, upload.single('coverImage'), createBlog);
router.route('/b/:slug/comment').post(authMiddleware, postComment); //in comments.js
router.route('/b/:slug/liked').patch(authMiddleware, likeAndDislikeBlog);
router.route('/comment/:slug/liked').patch(authMiddleware, likeAndDislikeComment)

export default router