import express from "express";
import { isAdmin, isAuth } from "../middleware/isAuth.js";
import { createProduct, deleteProduct, getAllOrders, getAllProducts, getAllStats, getAllUser, getSingleProducts, productFilter, updateOrderStatus, updateRole } from "../controllers/adminControler.js"
import { uploadFiles } from "../middleware/multer.js"

const router = express.Router();


router.post('/create-product', isAuth, isAdmin, uploadFiles, createProduct);
router.get('get-all-product', getAllProducts);
router.get('get-single-product/:id', getSingleProducts);
// router.put('/update-product/:id', isAuth, isAdmin, uploadFiles, updateProduct);
router.delete("/delete-product/:id", isAuth, isAdmin, deleteProduct);
router.get('/get-stats', isAuth, isAdmin, getAllStats);
router.get("/get-all-users", isAuth, isAdmin, getAllUser);
router.put("/upadte-role/:id", isAuth, isAdmin, updateRole);
router.put("/search-product:keyword", productFilter);
router.get('get-all-orders', isAuth, isAdmin, getAllOrders);
router.put('/order-status/:id', isAuth, isAdmin, updateOrderStatus)



export default router;