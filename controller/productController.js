import slugify from 'slugify'
import productModel from '../models/productModel.js'
import categoryModel from '../models/categoryModel.js'
import orderModel from '../models/orderModel.js'
import fs from 'fs'
import { rm } from 'fs'
import { count } from 'console';
import braintree from 'braintree'

import dotenv from "dotenv";

dotenv.config();

// payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping, productId, discount } = req.body;
        // console.log()
        const photo = req.file;
        //validation
        if (!name) {
            return res.send({ message: "Name is required !" })
        }
        if (!slug) {
            return res.send({ message: "Slug is required !" })
        }
        if (!description) {
            return res.send({ message: "password is required !" })
        }
        if (!price) {
            return res.send({ message: "Price is required !" })
        }
        if (!category) {
            return res.send({ message: "Category of product is required !" })
        }
        if (!quantity) {
            return res.send({ message: "Quantity is required !" })
        }
        if (!shipping) {
            return res.send({ message: "Shipping is required !" })
        }
        if (!productId) {
            return res.send({ message: "Product id is required !" })
        }
        if (!discount) {
            return res.send({ message: "Discount is required !" })
        }
        if (!photo) {
            return res.send({ message: "Photo is required !" })
        }
        //find existing product on the bases of id
        const existingproductId = await productModel.findOne({ productId });

        if (existingproductId) {
            return res.status(200).send({
                success: false,
                message: "Product already exist",
            })
        }
        const products = await new productModel({
            name, description, price, category, quantity, shipping, productId, discount, photo: photo?.path, slug: slugify(name)
        }).save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating products"
        })
    }
};


// get all products
export const getProductController = async (req, res) => {
    try {
        const products = await productModel
            .find({})
            .populate('category')
            .limit(12)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "AllProducts",
            products,
            countTotal: products.length,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in getting products"
        })
    }
};


// get single product
export const getSingleProductController = async (req, res) => {
    try {
        const products = await productModel
            .findOne({ slug: req.params.slug })
            .populate("category");
        res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            products
        });
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in getting Single Products"
        })
    }
};


//get photo
// export const productPhotoController = async (req, res) => {
//     try {
//         const product = await productModel
//             .findById(req.params.pid).select("photo");
//         if (product.photo.data) {
//             res.set("Content-type", product.photo.contentType);
//             return res.status(200).send(product.photo.data);
//         }
//     } catch (error) {
//         // console.log(error)
//         res.status(500).send({
//             success: false,
//             error,
//             message: "Error in getting Product Photo"
//         })
//     }
// };


// delete product
export const deleteProductController = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.pid)
        rm(product.photo, () => {
            console.log("image deleted");
        });
        res.status(200).send({
            success: true,
            message: "Product Deleted successfully"
        })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in deleting Product"
        })
    }
}

//update product
export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" })
            case !description:
                return res.status(500).send({ error: "Description is Required" })
            case !price:
                return res.status(500).send({ error: "Price is Required" })
            case !category:
                return res.status(500).send({ error: "Category is Required" })
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" })
            case !photo && photo.size > 10000000:
                return res.status(500).send({ error: "Photo is Required and should be less than 1 MB" })
            case !shipping:
                return res.status(500).send({ error: "Shipping is Required" })
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid,
            { ...req.fields, slug: slugify(name) }, { new: true }
        )
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product updated Successfully",
            products,
        });
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in updating products"
        })
    }
};

// filter controller
export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            success: false,
            message: "Error while filtering products",
            error,
        })
    }
};

// product count
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            success: false,
            message: "Error in product count",
            error,
        })
    }
};

// product list controller
export const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        // console.log(error);
        res.status(400).send({
            success: false,
            message: "error in per page ctrl",
            error,
        });
    }
}

// search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await productModel
            .find({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                ],
            })
            .select("-photo");
        res.json(results);
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error In Search Product API',
            error
        })
    }
}

// similar products
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("_photo").limit(3).populate("category")
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            success: false,
            message: "error while getting related products",
            error
        })
    }
}


// get product by category
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).populate("category");
        // console.log(products)
        res.status(200).send({
            success: true,
            category,
            products,
        })
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            success: false,
            message: "error while getting  product",
            error,
        });
    }
};


//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};


//payment
export const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
            },
        },
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error)
                }
            })
    } catch (error) {
        console.log(error)
    }
};
