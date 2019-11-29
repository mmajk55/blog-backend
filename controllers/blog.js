const Post = require('../models/post');

exports.createPost = async ({ body }, res, next) => {
    const title = body.title;
    const content = body.content;
    const post = new Post({
        title: title,
        content: content
    });
    try {
        await post.save();
        res.status(201).json({
            message: 'Post created successfully!',
            post: post
        })
    } catch (err) {
        console.log(err);
    }
}
