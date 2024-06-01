const express = require("express");
const dotenv = require("dotenv");
const userApi = require("./src/routes/user");
const authApi = require("./src/routes/auth");

const verifyToken = require("./src/middleware/verifyToken");

dotenv.config({path: ".env"});

const app = express();
app.use(express.json());

// Instantiate APIs
app.use(verifyToken);
app.use(authApi);
app.use("/user", userApi);

module.exports = app;