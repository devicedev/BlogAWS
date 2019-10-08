const faker = require("faker");
const jwt = require("@utils/jwt");
const uuidv4 = require("uuid/v4");

module.exports = {
    makeTestCreateUserData,
    makeTestLoginUserData,
    makeTestAuthHeader,
    makeTestMeUserData
};

const validId = uuidv4();

const validName = faker.name.firstName();

const validPassword = faker.random.alphaNumeric(6) + "A1";

const validEmail = faker.internet.exampleEmail();

function makeTestCreateUserData() {
    return Object.freeze({
        name: validName,
        password: validPassword,
        email: validEmail
    });
}

function makeTestLoginUserData() {
    return Object.freeze({
        password: validPassword,
        email: validEmail
    });
}
function makeTestAuthHeader(user = makeTestMeUserData()) {
    return Object.freeze({
        "x-auth": jwt(user)
    });
}
function makeTestMeUserData() {
    return Object.freeze({
        id: validId,
        ...makeTestCreateUserData(),
    });
}
