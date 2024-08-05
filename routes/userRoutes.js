import express from "express"
import { checkout, forgotPassword, loginUser, myOrder, myProfile, placeOrder, register, resetPassword, updateProfile, verifyUser } from "../controllers/userController.js";
import { isAuth } from "../middleware/isAuth.js";


const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
router.post("/forgotpassword", forgotPassword)
router.post("/resetpassword", resetPassword)
router.get("/profile", isAuth, myProfile)
router.get("/update-profile", isAuth, updateProfile)
router.get("/get-my-order", isAuth, myOrder);
// check out route
router.post("/checkout/:id", isAuth, checkout);
router.post("/place-order/:id", isAuth, placeOrder);




export default router;


