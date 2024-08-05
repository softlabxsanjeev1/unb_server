import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        require: false
    },
    category: {
        type: mongoose.ObjectId,
        ref: 'Category',
        required: true,
    },
    productId: {
        type: String,
        require: true,
        unique: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        require: true,
    },
    shipping: {
        type: String,
        require: true,
    },
    review: {
        type: String,
        require: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


export const Products = mongoose.model("Products", schema);