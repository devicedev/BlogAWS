const faker = require("faker");
const uuidv4 = require("uuid/v4");

module.exports = {
    makeTestCreatePostData,
};

function makeTestCreatePostData() {
    return Object.freeze({
        title: faker.lorem.word(),
        content: faker.lorem.paragraph(),
        draft: faker.random.boolean(),
        userId: uuidv4()
    });
}
