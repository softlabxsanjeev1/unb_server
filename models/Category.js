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
});

export const Category = mongoose.model("Category", schema);