import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            minLength: [9, "Phone Number Must Contain Exact 11 Digits!"],
            maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
        },
        address: {
            type: {},
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "user",
            enum: ["user", "admin"],
        },
    }, { timestamps: true })

export default mongoose.model('users', userSchema)