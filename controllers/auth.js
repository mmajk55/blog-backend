const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send(errors);
    }
    try {
        const { email, name, lastName, password } = req.body;
        const hashedPw = await bcrypt.hash(password, 12);
        const user = new User({
            email,
            name,
            lastName,
            password: hashedPw
        })
        const result = await user.save();
        res.status(201).send({ message: 'User created', userId: result._id })
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async ({ body }, res, next) => {
    const { email, password } = body;
    let loadedUser;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('A user with this email could not be found.')
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ 
            email: loadedUser.email, 
            userId: loadedUser._id.toString() 
            }, 
            'secret', 
            { expiresIn: '1h' }
        );
        res.status(200).send({ token: token, userId: loadedUser._id.toString() });
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};