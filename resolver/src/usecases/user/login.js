const bcrypt = require("bcryptjs");

const { InvalidEmailOrPasswordException } = require("@exceptions");

module.exports = ({ retrieveAllUsers }) => async input => {
    const users = await retrieveAllUsers();

    const user = users.find(user => user.email === input.email);

    if (!user) throw InvalidEmailOrPasswordException();

    const isValid = await bcrypt.compare(input.password, user.password);

    if (!isValid) throw InvalidEmailOrPasswordException();

    return user;
};
