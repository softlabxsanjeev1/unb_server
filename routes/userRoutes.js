import express from "express"
import { addAddress, forgotPassword, getAddresses, loginUser, myOrder, placeOrder, register, resetPassword, updateProfile, verifyUser } from "../controllers/userController.js";


const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
router.post("/forgotpassword", forgotPassword);
router.post("/add-address", addAddress);
router.get("/get-addresses", getAddresses);
router.post("/resetpassword", resetPassword);
router.put("/update-profile/:id", updateProfile);
router.get("/get-my-order", myOrder);
router.post("/place-order", placeOrder);




export default router;


