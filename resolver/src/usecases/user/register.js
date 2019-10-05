const {
    factory: {create}
} = require('@user');

const {UserAlreadyExistsException} = require('@exceptions');


module.exports = ({saveUser, getAllUsers}) => async (creationInputData) => {
    console.log("register func");
    const users = await getAllUsers();
    console.log(users);
    if (emailTaken(creationInputData.email, users))
        throw UserAlreadyExistsException();

    console.log("user");
    const user = await create(creationInputData);

    await saveUser(user);

    return user;

};

function emailTaken(email, users) {
    return users.some((user) => user.email === email);
}