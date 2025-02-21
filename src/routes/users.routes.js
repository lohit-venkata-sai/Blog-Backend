import { Router } from "express";
import { registerUser, userLogin, userLogout, userEditPassword, getUserDetails } from "../controllers/users.js";
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


//secure routes
router.route('/logout').get(authMiddleware, userLogout);
router.route('/user-profile').get(authMiddleware, getUserDetails);
router.route('/edit-password').put(authMiddleware, userEditPassword);
// router.route('/user-info-edit').put(authMiddleware, userInfoEdit);


export default router;