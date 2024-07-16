import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import {
    braintreePaymentController,
    braintreeTokenController,
    createProductController,
    deleteProductController,
    getProductController,
    getSingleProductController,
    productCategoryController,
    productCountController,
    productFiltersController,
    productListController,
    relatedProductController,
    searchProductController,
    updateProductController
} from '../controller/productController.js';
import { uploadFiles } from '../helpers/multer.js';

const router = express.Router()

//routes

//create products
router.post('/create-product', requireSignIn, isAdmin, uploadFiles, createProductController);

// get products
router.get('/get-product', getProductController);

// get single product
router.get('/get-product/:slug', getSingleProductController);

//get photo
// router.get('/product-photo/:pid', productPhotoController)

//update products
router.put('/update-product/:pid', requireSignIn, isAdmin, uploadFiles, updateProductController);

//delete product
router.delete('/delete-product/:pid', deleteProductController)

// filter product
router.post('/product-filters', productFiltersController)

//product count
router.get('/product-count', productCountController)

//product per page
router.get('/product-list/:page', productListController)

// search product
router.get('/search:keyword', searchProductController)

//similar product
router.get('/related-product/:pid/:cid', relatedProductController)

//category wise product
router.get('/product-category/:slug', productCategoryController)


//payments routes
//token
router.get('/braintree/token', braintreeTokenController)

//payments
router.post('/braintree/payment', requireSignIn, braintreePaymentController)


export default router;