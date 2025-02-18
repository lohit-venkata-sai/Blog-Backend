import { Router } from "express";
import { registerUser } from "../controllers/users.js";
import upload from '../middlewares/multer.middleware.js'
const router = Router();

router.route('/register').post(upload.none(), registerUser);

export default router;