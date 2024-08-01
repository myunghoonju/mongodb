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

commentRouter.patch("/:commentId", async(req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    const [comment, blog] = await Promise.all([
        Comment.findOneAndUpdate( { _id: commentId }, { content: content }, { new: true } ),
        Blog.updateOne( { 'comments._id': commentId }, { 'comments.$.content': content } )
    ])

    return res.send({ comment });
})

commentRouter.delete("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findOneAndDelete({ _id: commentId })
    await Blog.updateOne({"comments._id": commentId}, {$pull: {comments: { _id: commentId}}} )


    return res.send( {comment} )
})
module.exports = commentRouter