import express from "express"
import { addAddress, forgotPassword, getAddresses, getProducts, loginUser, myOrder, placeOrder, register, resetPassword, searchProducts, updateProfile, verifyUser, } from "../controllers/userController.js";

const router = express.Router();

router.post('/register', register);
router.post('/verify', verifyUser);
router.post('/login', loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/add-address", addAddress);
router.get("/get-addresses/:id", getAddresses);
router.put("/update-profile/:id", updateProfile);
router.get("/category-product/:slug", getProducts);
router.get("/search-keyword/:search", searchProducts)
router.post("/place-order", placeOrder);
router.get("/get-my-order/:id", myOrder);




export default router;


