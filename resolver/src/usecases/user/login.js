const bcrypt = require('bcrypt');

const {InvalidEmailOrPasswordException} = require('@exception');

module.exports = ({getAllUsers}) => async (input) => {
    const users = await getAllUsers();

    const user = users.find((user) => user.email === input.email);

    if (!user)
        throw InvalidEmailOrPasswordException();


    const isValid = await bcrypt.compare(input.password, user.password);

    if (!isValid)
        throw InvalidEmailOrPasswordException();

    return user;

};