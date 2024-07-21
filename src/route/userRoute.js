const User = require('../models/User')
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

    let user = await User.deleteOne({ _id: id });
    return res.send({ user })
})

userRouter.put('/:id', async (req, res) => {
    const id = req.params.id;
    const {email, username} = req.body;
    if (!mongo.isValidObjectId(id)) {
        return res.status(404).send({ err: 'invalid id' })
    }

    let user = await User.findByIdAndUpdate(id, { $set: { email, username }}, { new: true });

    return res.send({ user })
})

module.exports = userRouter