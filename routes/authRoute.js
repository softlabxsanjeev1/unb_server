import express from 'express'
import {
    forgotPasswordController,
    getAllOrdersController,
    getOrdersController,
    loginController,
    orderStatusController,
    registerController,
    statsController,
    testController,
    updateProfileController
} from '../controller/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

//router object to create route
const router = express.Router()

//routing
// Register || method Post
router.post('/register', registerController);

//LOGIN || POST
router.post('/login', loginController);

//Forgot password
router.post("/forgot-password", forgotPasswordController)

// test routes
router.get('/test', requireSignIn, isAdmin, testController);

//protected user route auth
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
})

//protected Admin route auth
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

//update profile
router.put('/profile', requireSignIn, updateProfileController)

//orders
router.get("/orders", requireSignIn, getOrdersController);

// all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// all stats
router.get("/all-stats", requireSignIn, isAdmin, statsController);

//order status update
router.put('/order-status/:orderId', requireSignIn, orderStatusController)


export default router;