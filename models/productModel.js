import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
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
    photo: {
        type: String,
        require: true,
    },
    shipping: {
        type: String,
        require: true,
    },
},
    { timestamps: true }
);

export default mongoose.model("Products", productSchema);