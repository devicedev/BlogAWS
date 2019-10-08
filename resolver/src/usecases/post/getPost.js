const { PostNotFoundException } = require("@exceptions");

module.exports = ({ retrievePost }) => async id => {
    const post = await retrievePost(id);

    if (!post) throw PostNotFoundException();

    return post;
};
