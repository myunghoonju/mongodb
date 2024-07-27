const { Router } = require('express')
const commentRouter = Router( { mergeParams: true })
const Comment = require('../models/Comment')
const User = require("../models/User");
const Blog = require("../models/Blog");

commentRouter.post('/', async (req, res) => {
    try {
        let { blogId }  = req.params;
        let { content, userId } = req.body

        const [user, blog] = await Promise.all([
            User.findById(userId), Blog.findById(blogId)
        ])

        let comment = new Comment({ content, user, blog });
        await comment.save()
        return res.send({ comment })
    } catch (e) {
        console.error(e)
        res.status(500).send({ err: e.message })
    }

})

commentRouter.get('/', async (req, res) => {
    try {
        let { blogId }  = req.params;
        return res.send(await Comment.find( { blog: blogId }));
    } catch (e) {
        console.error(e)
        res.status(500).send({ err: e.message })
    }

})

module.exports = commentRouter