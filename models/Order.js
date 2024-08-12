import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    user: {
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
        },
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    shippingAddress: {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        houseno: {
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
        city: {
            type: String,
            required: true,
        },
        statename: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
            default: "India"
        },
        postalCode: {
            type: Number,
            required: true,
        }
    },
    // cod || online pay 
    // paymentMethod: {
    //     type: String,
    //     required: true,
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
