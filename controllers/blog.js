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

exports.getPost = async ({ params }, res, next) => {
    try {
        const id = params.id;
        const post = await Post.findById(id);
        res.status(200).send({
            post: mapPosts(post)
        });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.updatePost = async ({ params, body }, res, next) => {
    try {
        const id = params.id;
        const { title, content } = body;
        await Post.findByIdAndUpdate(id, {
            $set: { title, content }
        });
        res.status(200).send({ message: 'Post updated successfully!' });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.deletePost = async ({ params }, res, next) => {
    try {
        const id = params.id;
        await Post.findByIdAndRemove(id, {
            useFindAndModify: false
        });
        res.status(200).send({ message: 'Post deleted successfully!' });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};