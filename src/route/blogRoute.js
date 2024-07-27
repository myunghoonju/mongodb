const { Router } = require('express')
const blogRouter = Router()
const Blog = require('../models/Blog')
const User = require('../models/User')
const commentRouter = require('./commentRoute')
const {isValidObjectId} = require("mongoose");

blogRouter.use("/:blogId/comment", commentRouter);

blogRouter.post('/', async (req, res) => {
    try {
        const { title, content, islive, userId } = req.body
        if (typeof (title || content) !== 'string') {
            res.status(400).send({err: 'title or content is required' });
        }

        if (typeof islive !== "boolean") {
            res.status(400).send({
                err: 'islive must be a boolean'
            });
        }

        if (!isValidObjectId(userId)) {
            res.status(400).send({
                err: 'invalid userId'
            });

        }

        let user = await User.findById(userId)
        let blog = new Blog({ ...req.body, user })
        await blog.save();
        return res.send({ blog })
    } catch (e) {
        console.error(e)
        res.status(500).send({ err: e.message })
    }

})

blogRouter.get('/', async (req, res) => {
    try {
        return res.send(await Blog.find());
    } catch (e) {
        console.error(e)
        res.status(500).send({ err: e.message })
    }

})

blogRouter.get('/:blogId', async (req, res) => {
    try {
        let { blogId } = req.params;
        return res.send(await Blog.findOne({ _id: blogId }));
    } catch (e) {
        console.error(e)
        res.status(500).send({ err: e.message })
    }

})

blogRouter.put('/:blogId', async (req, res) => {
    try {
        let { blogId } = req.params;
        let { title, content } = req.body;
        return res.send(await Blog.findOneAndUpdate({ _id: blogId}, { title, content }, { new: true }))

    } catch (e) {
        console.error(e)
        res.status(500).send({ err: e.message })
    }

})

blogRouter.patch('/:blogId/live', async (req, res) => {
    try {
        let { blogId } = req.params;
        let { alive } = req.body;
        return res.send(await Blog.findByIdAndUpdate( blogId, { alive }, { new: true }))
    } catch (e) {
        console.error(e)
        res.status(500).send({ err: e.message })
    }

})

module.exports = blogRouter