const jsonwebtoken = require('jsonwebtoken');
const constants = require('../constants');

const { SECRET_KEY, GET_USER: getUser } = constants;


const excludedPaths = [
    '/login',
    '/register'
];

const verifyToken = (req, res, next) => {
    if (excludedPaths.includes(req.path)) {
        return next();
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // If token is null, return 401 Unauthorized
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    try {
        const decoded = jsonwebtoken.verify(token, SECRET_KEY);

        const user = getUser(decoded.id);
        if (user.session_uuid !== decoded.session_uuid) {
            return res.status(401).send('Unauthorized');
        }

        req.currentUser = decoded;
        next();
    } catch (ex) {
        return res.status(401).send('Unauthorized');
    }
}

module.exports = verifyToken;