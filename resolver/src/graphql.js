require('module-alias/register');
require('@logger');

const jwt = require('@utils/jwt');

const {createSuccessResponse, createFailureResponse} = require('./utils/graphql/mutationResultFactory');

const getAuthUser = require('@utils/getAuthUser');

const {
    user: {register, login},
    post: {createPost}


} = require('@usecases');

const {
    user: {getUser, saveUser, getAllUsers},
    post: {getPost, savePost, updatePost}
} = require('@repository');


exports.resolver = async ({field, arguments: {input}, headers}) => {
    switch (field) {
        case 'register':
            return await resolveRegister(input, headers);
        case 'login':
            return await resolveLogin(input, headers);
        case 'me':
            return await resolveMe(headers);
        case 'createPost':
            return await resolveCreatePost(input, headers);
        case 'updatePost':
            return await resolveUpdatePost(input, headers);
    }
};

async function resolveRegister(input, headers) {
    try {
        const userData = await register({saveUser, getAllUsers})(input);

        const userDataWithJWT = Object.freeze({

            jwt: jwt(userData),

            ...userData
        });

        return createSuccessResponse(userDataWithJWT);

    } catch (err) {
        return createFailureResponse(err);
    }
}

async function resolveLogin(input, headers) {
    try {
        const user = await login({getAllUsers})(input);

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
        const authUser = await getAuthUser({getUser})(headers);

        return createSuccessResponse(authUser);

    } catch (err) {
        return createFailureResponse(err);
    }
}

async function resolveCreatePost(input, headers) {
    try {
        const authUser = getAuthUser({getUser})(headers);

        const post = await createPost({savePost})(input, authUser);

        return createSuccessResponse(post);
    } catch (err) {
        return createFailureResponse(err);
    }
}

async function resolveUpdatePost(input, headers) {
    try {
        const authUser = getAuthUser({getUser})(headers);

        const post = await updatePost({getPost, savePost})(input);

        return createSuccessResponse(post);

    } catch (err) {
        return createFailureResponse(err);
    }


}