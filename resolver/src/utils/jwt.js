const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config");

module.exports = (userData) => jwt.sign({ userId: userData.id }, jwtSecret);
