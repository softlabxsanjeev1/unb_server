import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    gender: {
        type: String
    },
    age: {
        type: Number
    },
    verified: {
        type: Boolean,
        default: true
    },
    verificationToken: String,
    addresses: [
        {
            name: String,
            phone: String,
            houseno: String,
            street: String,
            landmark: String,
            city: String,
            country: String,
            postalCode: String
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
},
    { timestamps: true }
);


export const User = mongoose.model("User", schema);