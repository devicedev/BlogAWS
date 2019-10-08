const {
    factory: { create }
} = require("@post");

module.exports = ({ savePost }) => async (authUser, input) => {
    const postData = create({
        ...input,
        userId: authUser.id
    });

    await savePost(postData);

    return postData;
};
