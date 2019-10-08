const {
    behaviour: { update }
} = require("@post");

const {
    PostNotFoundException,
    UserHasNoAccessToPostException
} = require("@exceptions");

module.exports = ({ retrievePost, savePost }) => async (authUser, input) => {
    let post = await retrievePost(authUser.id, input.id);

    if (!post) throw PostNotFoundException();

    if (post.userId !== authUser.id) throw UserHasNoAccessToPostException();

    post = update(post, input.updateFields);

    await savePost(post);

    return post;
};
