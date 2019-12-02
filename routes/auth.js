const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom(async (value, { req }) => {
            try {
                const userDoc = await User.findOne({ email: value });
                if (userDoc) {
                    return Promise.reject('E-mail address already exisits!');
                }
            } catch(err) {
                console.log(err);
            }
        })
        .normalizeEmail(),
    ],
    authController.signup
);

router.post('/login', authController.login);

module.exports = router;