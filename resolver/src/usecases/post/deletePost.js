const {
    UserHasNoAccessToPostException,
    PostNotFoundException
} = require("@exceptions");

module.exports = ({ retrievePost, removePost }) => async (authUser, input) => {
    const post = await retrievePost(authUser.id, input.id);

    if (!post) throw PostNotFoundException();

    if (post.userId !== authUser.id) throw UserHasNoAccessToPostException();

    await removePost(authUser.id, input.id);
};
