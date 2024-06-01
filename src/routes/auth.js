const express = require('express');
const argon2 = require('argon2');
const jsonwebtoken = require('jsonwebtoken');
const { v4 } = require('uuid');
const constants = require('../constants');
const { User } = require('../models');


const { USERS: users, SECRET_KEY, GET_USER: getUser } = constants;

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const foundUser = users.find(u => u.username ===username);

    const verifiedPassword = foundUser && await argon2.verify(foundUser.password, password);

    if (!foundUser || !verifiedPassword) {
        return res.status(401).send('Invalid username or password.');
    }

    foundUser.session_uuid = v4();

    const token = jsonwebtoken.sign(foundUser, SECRET_KEY);
    return res.send(token);
});

router.post('/register', async (req, res) => {
    // const userId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    // const existingUser = users.find(u => u.username === req.body.username);
    // if (existingUser) {
    //     return res.status(401).send('Invalid Register Data.');
    // }

    // const newUser = {
    //     // id: userId,
    //     name: req.body.name,
    //     age: req.body.age,
    //     username: req.body.username,
    //     password: await argon2.hash(req.body.password)
    // };

    // users.push(newUser);'
    
    const newUser = new User(
        null, 
        req.body.name, 
        req.body.age, 
        req.body.username, 
        await argon2.hash(req.body.password), 
        v4()
    );

    await newUser.save();

    return res.status(201).send(`Created User: ${newUser.username}`);
});

router.post('/logout', (req, res) => {
    const user = req.currentUser;

    const serverUser = getUser(user.id);
    serverUser.session_uuid = v4();

    return res.status(200).send('Logout successful.');
});

module.exports = router;