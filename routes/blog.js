const express = require('express');

const router = express.Router();

const blogController = require('../controllers/blog');

router.get('/posts', blogController.getPosts);

router.post('/post', blogController.createPost);

router.get('/post/:id', blogController.getPost);

router.put('/update-post/:id', blogController.updatePost);

router.delete('/delete-post/:id', blogController.deletePost);

module.exports = router;