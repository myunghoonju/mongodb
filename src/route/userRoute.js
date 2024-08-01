const { User } = require('../models/User')
const {Blog} = require("../models/Blog");
const {Comment} = require('../models/Comment')
const  Router  = require('express');
const mongo= require("mongoose");
const userRouter = Router();

userRouter.get('/', async (req, res) => {
    try {
        const users = await User.find({})
        return res.send({ users: users })
    } catch (e) {
        console.log(e)
    }
})

userRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongo.isValidObjectId(id)) {
            return res.status(404).send({ err: 'invalid id' })
        }

        let user = await User.findOne({ _id: id });
        return res.send({ user })
    } catch (e) {
        console.log(e)
        return res.status(404).send({ error: e.message })
    }
})

userRouter.post('/', async (req, res) => {
    try  {
        const user = new User(req.body);
        await user.save();
        return res.send({ user })
    } catch (e) {
        console.log(e)
        return res.status(500).send({ err: e.message })
    }
})

userRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!mongo.isValidObjectId(id)) {
        return res.status(404).send({ err: 'invalid id' })
    }

   const user = await Promise.all([
        User.findOneAndDelete({ _id: id }),
        Blog.deleteMany({ "user._id": id }),
        Blog.updateMany({"comments.user": id}, {$pull: { comments: { user:id } } }),
        Comment.deleteMany({ user: id })
    ])

    return res.send({ user })
})

userRouter.put('/:id', async (req, res) => {
    const id = req.params.id;
    const name = req.body;
    if (!mongo.isValidObjectId(id)) {
        return res.status(404).send({ err: 'invalid id' })
    }

    let user = await User.findById(id);
    // not working
    if (name) {
        user.name = name
        await Promise.all([
            await Blog.updateMany({"user._id": id}, { "user": name }),
            await Blog.updateMany(
                {},
                {"comments.$[comment].userFullName": `${name.first} ${name.last}`},
                { arrayFilters: [{"comment.user": id}] })
        ])
    }

    await user.save()
    return res.send({ user })
})

module.exports = userRouter