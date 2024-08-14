import express from "express"
import { addAddress, getAddresses, loginUser, myOrder, placeOrder, register, updateProfile, verifyUser, } from "../controllers/userController.js";


const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
// router.post("/forgotpassword", forgotPassword);
router.post("/add-address", addAddress);
router.get("/get-addresses/:id", getAddresses);
// router.post("/resetpassword", resetPassword);
router.put("/update-profile/:id", updateProfile);
router.post("/place-order", placeOrder);
router.get("/get-my-order/:id", myOrder);




export default router;


