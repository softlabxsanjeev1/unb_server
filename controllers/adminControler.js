import TryCatch from "../middleware/TryCatch.js";
import { Products } from "../models/Products.js"
import { Category } from '../models/Category.js';
import { rm } from "fs"
import { User } from "../models/User.js";
import { Order } from '../models/Order.js'



// create product 
export const createProduct = TryCatch(async (req, res) => {
    const { name, slug, createdBy, description, price, category, quantity, shipping, productId, discount, review } = req.body;
    const image = req.file;

    //find existing product on the bases of id
    const existingproductId = await Products.findOne({ productId });

    if (existingproductId) {
        return res.status(200).send({
            success: false,
            message: "Product already exist",
        })
    }

    const product = await new Products({ name, slug, createdBy, description, price, category, quantity, shipping, productId, discount, review, image: image?.path, }).save();

    res.status(201).json({
        message: "Product Created Successfully",
        product,
    });
});


// get All Products
export const getAllProducts = TryCatch(async (req, res) => {
    const products = await Products
        .find({})
        .populate('category')
        .sort({ createdAt: -1 });
    res.json({
        products
    });
});


// get Single Products
export const getSingleProduct = TryCatch(async (req, res) => {
    const product = await Products.findById(req.params.id)
    res.json({
        message: "Single Product Fetched",
        product
    });
});


export const deleteProduct = TryCatch(async (req, res) => {
    const product = await Products.findById(req.params.id);
    rm(product.image, () => {
        // console.log("image deleted");
    });
    await product.deleteOne();
    res.json({
        message: "Product Deleted",
    });
});


//update product
// export const updateProduct = TryCatch(async (req, res) => {
//     const { name, slug, createdBy, description, price, category, quantity, shipping, productId, discount, review } = req.body;
//     const image = req.file;


//     const product = await new Products({ name, slug, createdBy, description, price, category, quantity, shipping, productId, discount, review, image: image?.path, }).save();

//     res.status(201).json({
//         message: "Product Created Successfully",
//         product,
//     });
// });


// show similar products



// get All Stats
export const getAllStats = TryCatch(async (req, res) => {
    const totalUsers = (await User.find()).length;
    const totalProducts = (await Products.find()).length;
    const totalOrders = (await Order.find()).length;
    const totalCategoris = (await Category.find()).length;
    const stats = {
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategoris
    };
    res.status(200).json(
        stats
    );
});


// get all users 
export const getAllUser = TryCatch(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
        "-password"
    );

    res.json({ users });
});


// show product according to category
export const productFilter = TryCatch(async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug });
    const products = await Products.find({ category }).populate("category");

    res.json({
        products
    });
});


// update user role
export const updateRole = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user.role === "user") {
        user.role = "admin";
        await user.save()

        return res.status(200).json({
            message: "Role updated to admin"
        });
    }

    if (user.role === "admin") {
        user.role = "user";
        await user.save()

        return res.status(200).json({
            message: "Role updated"
        });
    }
})


// get all Orders
export const getAllOrders = TryCatch(async (req, res) => {
    const Orders = await Order.find({})
        .sort({ createdAt: -1 });
    res.json({ Orders });
});



// update Orders status
export const updateOrderStatus = TryCatch(async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    );
    res.json(orders);
});






