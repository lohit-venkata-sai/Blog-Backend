import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getLikedBlogs } from "../controllers/users.js";

const router = Router();

router.route('/').get(authMiddleware, getLikedBlogs);

export default router