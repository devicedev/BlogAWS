const {
    factory: {create}
} = require('@post');

module.exports = ({savePost}) => async (input, authUser) => {
    const postData = await create({
        ...input,
        userId: authUser.id
    });

    await savePost(postData);

    return postData;
};