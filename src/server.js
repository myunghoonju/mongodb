const express = require('express')
const app = express()
const userRouter = require('./route/userRoute')
const blogRouter = require('./route/blogRoute')
const mongo = require('mongoose')

app.use(express.json())

const URL = 'mongodb+srv://myunghoonju:tWEIhtgybes6sBui@cluster-free.ypct40n.mongodb.net/BlogService?retryWrites=true&w=majority&appName=Cluster-free'

const server = async() => {
    try {
        let connected= await mongo.connect(URL);
        mongo.set('debug', true)
        console.log({connected});
        app.use('/user', userRouter)
        app.use('/blog', blogRouter)

        app.listen(3000, function () {
            console.log('Server started on port 3000')
        })
    } catch (err) {
        console.log(err)
    }

}

server();
