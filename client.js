console.log('run client');
const axios = require('axios');

let test = async () => {
    let {
        data:  blogs   ,
    } = await axios.get('http://localhost:3000/blog')

   blogs = await Promise.all(
        blogs.map( async blog => {
            const [res1, res2] = await Promise.all([
                await axios.get(`http://localhost:3000/user/${blog.user._id}`),
                await axios.get(`http://localhost:3000/blog/${blog._id}/comment`)
            ])
            blog.user = res1.data.user
            blog.comments = res2.data.comments

            console.log(blog)
            return blog
    }));

    console.dir(blogs, {depth: 10})
}

test()