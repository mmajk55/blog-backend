const _ = require("lodash");
const Post = require("../models/post");
const User = require("../models/user");

const mapPosts = posts => {
  const { _id, title, content, createdAt } = posts;

  return {
    id: _id,
    title,
    content,
    date: createdAt
  };
};

exports.createPost = async (req, res, next) => {
  const { title, content } = req.body;
  let creator;
  const post = new Post({
    title,
    content,
    creator: req.userId
  });
  try {
    await post.save();
    const user = await User.findById(req.userId);
    creator = user;
    user.posts.push(post);
    await user.save();
    res.status(201).json({
      message: "Post created successfully!",
      post: post,
      creator: { id: creator._id, name: creator.name }
    });
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
      message: "Fetched posts successfully.",
      posts: _.map(posts, mapPosts)
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ creator: req.userId });
    res.status(200).send({
      message: "Fetched posts successfully.",
      posts: _.map(posts, mapPosts)
    });
  } catch (err) {
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
  } catch (err) {
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
    res.status(200).send({ message: "Post updated successfully!" });
  } catch (err) {
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
    res.status(200).send({ message: "Post deleted successfully!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
