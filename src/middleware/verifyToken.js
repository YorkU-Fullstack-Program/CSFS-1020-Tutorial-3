const jsonwebtoken = require("jsonwebtoken");
const constants = require("../constants");
const { User } = require("../models");

const { SECRET_KEY, } = constants;

const excludedPaths = ["/login", "/register"];

const verifyToken = async (req, res, next) => {
  if (excludedPaths.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  // If token is null, return 401 Unauthorized
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  try {
    const decoded = jsonwebtoken.verify(token, SECRET_KEY);
    const user = await User.findOne({ id: decoded.id });

    if (!user || user.session_uuid !== decoded.session_uuid) {
      return res.status(401).send("Unauthorized");
    }

    req.currentUser = user;
    next();
  } catch (ex) {
    return res.status(401).send("Unauthorized");
  }
};

module.exports = verifyToken;
