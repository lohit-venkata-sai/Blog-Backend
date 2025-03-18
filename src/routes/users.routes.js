import { Router } from "express";
import { registerUser, userLogin, userLogout, userEditPassword, getUserInfo, userProfile, getLikedBlogs } from "../controllers/users.js";
import upload from '../middlewares/multer.middleware.js'
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
router.route('/register').post(upload.fields([{
    name: 'avatar',
    maxCount: 1,
}, {
    name: 'banner',
    maxCount: 1,
}]), registerUser);

router.route('/login').get(upload.none(), userLogin);
router.route('/u/:id').get(userProfile);

//secure routes
router.route('/logout').get(authMiddleware, userLogout);
router.route('/getInfo').get(authMiddleware, getUserInfo);
router.route('/edit-password').put(authMiddleware, userEditPassword);
// router.route('/user-info-edit').put(authMiddleware, userInfoEdit);
router.route('/liked-blogs').get(authMiddleware, getLikedBlogs);


export default router;