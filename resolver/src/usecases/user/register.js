const {
    factory: {create}
} = require('@user');

const {UserAlreadyExistsException} = require('@exceptions');


module.exports = ({saveUser, getAllUsers}) => async (creationInputData) => {
    const users = await getAllUsers();

    if(emailTaken(creationInputData.email,users))
        throw UserAlreadyExistsException();

    const user = await create(creationInputData);

    await saveUser(user);

    return user;

};

function emailTaken(email, users) {
    return users.some((user) => user.email === email);
}