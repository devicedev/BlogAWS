module.exports = ({ retrieveUserPosts }) => async authUser =>
    await retrieveUserPosts(authUser.id);
