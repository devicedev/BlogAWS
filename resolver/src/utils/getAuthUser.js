const { NoJWTException, InvalidJWTException } = require("@exceptions");

const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../config");

module.exports = ({ retrieveUser }) => async headers => {
    const token = headers["x-auth"];

    if (!token) throw NoJWTException();

    let payload;

    try {
        payload = jwt.verify(token, jwtSecret);

    } catch (err) {
        throw InvalidJWTException();
    }

    const user = await retrieveUser(payload.userId);

    if (!user) throw InvalidJWTException();

    return {
        ...user,
        jwt: token
    };
};
