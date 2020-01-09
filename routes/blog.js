const express = require('express');

const router = express.Router();

const blogController = require('../controllers/blog');
const isAuth = require('../middleware/isAuth');

router.get('/posts', blogController.getPosts);

router.get('/user/posts', isAuth, blogController.getUserPosts);

router.post('/post', isAuth, blogController.createPost);

router.get('/post/:id', blogController.getPost);

router.put('/update-post/:id', isAuth, blogController.updatePost);

router.delete('/delete-post/:id', isAuth, blogController.deletePost);

module.exports = router;