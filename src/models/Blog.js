const { Schema, model, Types } = require('mongoose')
const mongoose = require("mongoose");

const BlogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    alive: { type: Boolean, required: true, default: false },
    user: new Schema({
        _id: { type: Schema.Types.ObjectId, ref: 'user' },
        username: { type: String, required: true },
        name: {
            first: { type: String, required: true },
            last: { type: String, required: true },
        },
        age: Number,
        email: String
    })
}, { timestamps: true });

const Blog = mongoose.model('blog', BlogSchema);

module.exports = { Blog }