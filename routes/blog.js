const express = require('express');

const router = express.Router();

const blogController = require('../controllers/blog');

router.post('/post', blogController.createPost);

module.exports = router;