import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: {
        type: String,
        require: true,
    },
});

export const Category = mongoose.model("Category", schema);