import express from 'express'
import { isAdmin, isAuth } from '../middleware/isAuth.js';
import { createCategory, deleteCategory, getAllcategory, singleCategory, updateCategory } from '../controllers/categoryController.js';

const router = express.Router()

//routes
// create category
router.post('/create-category', isAuth, isAdmin, createCategory);

//get all category
router.get('/get-category', getAllcategory);

//single category
router.get('/single-category/:slug', singleCategory)

//update category
router.put('/update-category/:id', isAuth, isAdmin, updateCategory);

//delete category
router.delete('/delete-category/:id', isAuth, isAdmin, deleteCategory)


export default router;