console.log('run client');
const axios = require('axios');

let test = async () => {
    console.time("loading time")
    let {
        data:  blogs   ,
    } = await axios.get('http://localhost:3000/blog')
   //
   // blogs = await Promise.all(
   //      blogs.map( async blog => {
   //          const [res1, res2] = await Promise.all([
   //              await axios.get(`http://localhost:3000/user/${blog.user._id}`),
   //              await axios.get(`http://localhost:3000/blog/${blog._id}/comment`)
   //          ])
   //          blog.user = res1.data.user
   //          blog.comments = res2.data.comments
   //
   //          return blog
   //  }));
    console.timeEnd("loading time")
}

const testG = async () => {
    await test()
    await test()
    await test()
    await test()
    await test()
    await test()
    await test()
    await test()
    await test()
    await test()
}

testG()