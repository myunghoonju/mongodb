const { Router } = require('express')
const commentRouter = Router( { mergeParams: true })
const {Comment} = require('../models/Comment')
const {User} = require("../models/User");
const {Blog} = require("../models/Blog");

commentRouter.post('/', async (req, res) => {
    try {
        let { blogId }  = req.params;
        let { content, userId } = req.body

        const [user, blog] = await Promise.all([
            User.findById(userId), Blog.findById(blogId)
        ])

        let comment = new Comment({ content, user, userFullName: `${user.name.first} ${user.name.last} ` ,blog });
        await Promise.all([ comment.save(),
                                   Blog.updateOne( { _id: blogId }, { $push: { comments: comment } } )
        ])
        return res.send({ comment })
    } catch (e) {
        console.error(e)
        res.status(500).send({ err: e.message })
    }

})

commentRouter.get('/', async (req, res) => {
    try {
        let { blogId }  = req.params;
        const comments = await Comment.find( { blog: blogId }).limit(10);
        return res.send({ comments});
    } catch (e) {
        console.error(e)
        res.status(500).send({ err: e.message })
    }

})

module.exports = commentRouter