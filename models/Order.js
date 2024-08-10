import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    products: [
        {
            name: {
                type: String,
                require: true,
            },
            productId: {
                type: String,
                require: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    ahippingAddress: {
        name: {
            type: String,
            required: true,
        },
        mobileNo: {
            type: String,
            required: true,
        },
        houseNo: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        landmark: {
            type: String,
            required: true,
        },
        postalCode: {
            type: Number,
            required: true,
        }
    },
    // cod || online pay 
    paymentMethod: {
        type: String,
        required: true,
    },
    // paymentInfo: {
    //     razorpay_order_id: {
    //         type: String,
    //         required: true,
    //     },
    //     razorpay_payment_id: {
    //         type: String,
    //         required: true,
    //     },
    // },
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

},
    { timestamps: true }
);


export const Order = mongoose.model("Order", schema);
