const {NoJWTException, InvalidJWTException} = require('@exceptions');

const jwt = require('jsonwebtoken');

const {jwtSecret} = require('../config');

module.exports = ({getUser}) => async (headers) => {
    const token = headers['x-auth'];

    if (!token)
        throw NoJWTException();
    let payload;
    try {

        payload = jwt.verify(token, jwtSecret).userId;


    } catch (err) {
        throw InvalidJWTException();
    }
    const user = await getUser(payload.userId);

    if(!user)
        throw InvalidJWTException();

    return user;

};