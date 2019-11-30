const _ = require('lodash');
const Post = require('../models/post');

const mapPosts = posts => {
    const { _id, title, content, createdAt} = posts;

    return {
        id: _id,
        title,
        content,
        date: createdAt
    };
};

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
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.status(200).send({
            message: 'Fetched posts successfully.',
            posts: _.map(posts, mapPosts)
        });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};