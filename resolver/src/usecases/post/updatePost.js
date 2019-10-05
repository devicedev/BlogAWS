const {
    behaviour: update
} = require('@post');

const {
    PostNotFoundException,
    UserHasNoAccessToPostException
} = require('@exception');

module.exports = ({getPost, savePost}) => async (authUser, input) => {
    let post = await getPost(input.id);

    if (!post)
        throw PostNotFoundException();

    if (post.userId !== authUser.id)
        throw UserHasNoAccessToPostException();

    post = update(post, input);

    await savePost(post);

    return post;

};