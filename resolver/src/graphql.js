require("module-alias/register");
require("@logger");

const jwt = require("@utils/jwt");

const {
    createSuccessResponse,
    createFailureResponse
} = require("./utils/graphql/mutationResultFactory");

const getAuthUser = require("@utils/getAuthUser");

const {
    user: { register, login },
    post: { createPost, updatePost, deletePost, getUserPosts }
} = require("@usecases");

const {
    user: { retrieveUser, saveUser, retrieveAllUsers },
    post: { retrievePost, savePost, removePost, retrieveUserPosts }
} = require("@repository");

exports.resolver = async ({ field, arguments: { input }, headers }) => {
    switch (field) {
        case "register":
            return await resolveRegister(input, headers);
        case "login":
            return await resolveLogin(input);
        case "me":
            return await resolveMe(headers);

        case "createPost":
            return await resolveCreatePost(input, headers);
        case "updatePost":
            return await resolveUpdatePost(input, headers);
        case "deletePost":
            return await resolveDeletePost(input, headers);
        case "getUserPosts":
            return await resolveGetUserPosts(input, headers);
    }
};

async function resolveRegister(input, headers) {
    try {
        const userData = await register({ saveUser, retrieveAllUsers })(input);

        const userDataWithJWT = Object.freeze({
            jwt: jwt(userData),

            ...userData
        });

        return createSuccessResponse(userDataWithJWT);
    } catch (err) {
        return createFailureResponse(err);
    }
}

async function resolveLogin(input) {
    try {
        const user = await login({ retrieveAllUsers })(input);

        const userWithJwt = Object.freeze({
            jwt: jwt(user),
            ...user
        });

        return createSuccessResponse(userWithJwt);
    } catch (err) {
        return createFailureResponse(err);
    }
}

async function resolveMe(headers) {
    try {
        const authUser = await getAuthUser({ retrieveUser })(headers);

        return createSuccessResponse(authUser);
    } catch (err) {
        return createFailureResponse(err);
    }
}

async function resolveCreatePost(input, headers) {
    try {
        const authUser = await getAuthUser({ retrieveUser })(headers);

        const post = await createPost({ savePost })(authUser, input);

        return createSuccessResponse(post);
    } catch (err) {
        return createFailureResponse(err);
    }
}

async function resolveUpdatePost(input, headers) {
    try {
        const authUser = await getAuthUser({ retrieveUser })(headers);

        const post = await updatePost({ retrievePost, savePost })(
            authUser,
            input
        );

        return createSuccessResponse(post);
    } catch (err) {
        return createFailureResponse(err);
    }
}

async function resolveDeletePost(input, headers) {
    try {
        const authUser = await getAuthUser({ retrieveUser })(headers);

        await deletePost({ retrievePost, removePost })(authUser, input);

        return createSuccessResponse();
    } catch (err) {
        return createFailureResponse(err);
    }
}

async function resolveGetUserPosts(input, headers) {
    try {
        const authUser = await getAuthUser({ retrieveUser })(headers);

        const posts = await getUserPosts({ retrieveUserPosts })(authUser);

        return createSuccessResponse(posts);
    } catch (err) {
        return createFailureResponse(err);
    }
}
