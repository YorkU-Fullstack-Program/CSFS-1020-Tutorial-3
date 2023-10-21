const express = require('express');
const argon2 = require('argon2');
const jsonwebtoken = require('jsonwebtoken');
const { v4 } = require('uuid');
const constants = require('../constants');
const User = require('../models/user');

const { SECRET_KEY } = constants;

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const foundUser = await User.findByUsername(username);
    if (!foundUser) {
        return res.status(401).send('Invalid username or password.');
    }

    if (!(await foundUser.isPasswordValid(password))) {
        return res.status(401).send('Invalid username or password.');
    }

    foundUser.session_uuid = v4();
    await foundUser.update();

    const token = jsonwebtoken.sign({...foundUser.toJSON(), session_uuid: foundUser.session_uuid}, SECRET_KEY);
    return res.send(token);
});

router.post('/register', async (req, res) => {
    const existingUser = await User.findByUsername(req.body.username);
    if (existingUser) {
        return res.status(401).send('Invalid Register Data.');
    }

    const newUser = new User(
        null,
        req.body.name,
        req.body.age,
        req.body.username,
        await argon2.hash(req.body.password),
        v4()
    );

    newUser.save();
    return res.status(201).send(`Created User: ${newUser.username}`);
});

router.post('/logout', async (req, res) => {
    await req.user.logout();

    return res.status(200).send('Logout successful.');
});

module.exports = router;