const {PostNotFoundException} = require('@exceptions');

module.exports = ({getPost}) => async (id) => {
    const post = await getPost(id);

    if(!post)
        throw PostNotFoundException();

    return post;
};