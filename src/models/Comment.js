const { Schema, model, Types: { ObjectId } } = require('mongoose');
const mongoose = require("mongoose");

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    userFullName: { type: String, required: true },
    blog: { type: Schema.Types.ObjectId, ref: 'blog' }
}, { timestamps: true })

const Comment = mongoose.model('comment', CommentSchema);

module.exports = { Comment, CommentSchema }