import TryCatch from '../middleware/TryCatch.js';
import { Category } from '../models/Category.js';
import slugify from 'slugify';

export const createCategory = TryCatch(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(401).send({ message: "Name is required" })
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        return res.status(200).send({
            success: true,
            message: 'Category Already Exists'
        })
    }
    const category = await new Category({ name, slug: slugify(name) }).save()

    res.status(201).json({
        message: "Category Created Successfully",
        category
    });
});


//update category
export const updateCategory = TryCatch(async (req, res) => {
    const { name } = req.body
    const { id } = req.params
    const category = await Category.findByIdAndUpdate(id,
        { name, slug: slugify(name) },
        { new: true }
    );

    res.status(200).json({
        message: "Category Updated Successfully",
        category,
    });
});

// get all category controller
export const getAllcategory = TryCatch(async (req, res) => {
    const category = await Category.find({})
    res.status(200).json({
        message: "All Categories List",
        category,
    });
});


// get single category
export const singleCategory = TryCatch(async (req, res) => {
    const { slug } = req.params.slug
    const category = await Category.findOne({ slug: slug })
    res.status(200).json({
        message: "Get Single Category Successfully",
        category
    });
});


export const deleteCategory = TryCatch(async (req, res) => {
    const { id } = req.params;
    await Category.findByIdAndDelete(id)
    res.status(200).json({
        message: "Category deleted Successfully",
    });
});


