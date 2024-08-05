import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    orderItems: [
        {
            product: {
                type: mongoose.ObjectId,
                ref: "Products",
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        },
    ],
    shippingAddress: {
        type: String,
        required: true,
    },
    buyer: {
        type: mongoose.ObjectId,
        ref: "Users",
    },
    paymentInfo: {
        razorpay_order_id: {
            type: String,
            required: true,
        },
        razorpay_payment_id: {
            type: String,
            required: true,
        },
    },
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    totalPrice: {
        type: Number,
        required: true
    },
},
    { timestamps: true }
);


export const Order = mongoose.model("Order", schema);
