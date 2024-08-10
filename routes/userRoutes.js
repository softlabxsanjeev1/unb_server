import express from "express"
import { addAddress, checkout, forgotPassword, getAddresses, loginUser, myOrder, placeOrder, register, resetPassword, updateProfile, verifyUser } from "../controllers/userController.js";


const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
router.post("/forgotpassword", forgotPassword);
router.post("/add-address", addAddress);
router.get("/get-all-addresses", getAddresses)
router.post("/resetpassword", resetPassword);
router.put("/update-profile/:id", updateProfile);
router.get("/get-my-order/:id", myOrder);
// check out route
router.post("/checkout/:id", checkout);
router.post("/place-order/:id", placeOrder);




export default router;


