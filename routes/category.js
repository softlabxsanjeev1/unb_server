import express from 'express'
import { isAdmin, isAuth } from '../middleware/isAuth.js';
import { createCategory, deleteCategory, getAllcategory } from '../controllers/categoryController.js';
import { uploadFiles } from '../middleware/multer.js';

const router = express.Router()

//routes
// create category
router.post('/create-category', isAuth, isAdmin, uploadFiles, createCategory);

//get all category
router.get('/get-category', getAllcategory);

//delete category
router.delete('/delete-category/:id', isAuth, isAdmin, deleteCategory)


export default router;