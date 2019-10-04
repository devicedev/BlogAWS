require('module-alias/register');
require('@logger');

const jwt = require('@utils/jwt');

const {createSuccessResponse, createFailureResponse} = require('./utils/graphql/mutationResultFactory');

const {getAuthUser} = require('@utils/getAuthUser');

const {
    user: {register, login},
    // posts: {createPost, getPost, getAllPosts}


} = require('@usecases');

const {
    user: {saveUser, getUser, getAllUsers}
} = require('@repository');


exports.resolver = async ({field, arguments: {input}, headers}) => {

    global.logInfo('graphql.resolve', {
        field,
        arguments,
        headers
    });

    switch (field) {

        case 'register':
            return await resolveRegister(input, headers);
        case 'login':
            return await resolveLogin(input, headers);
        case 'me':
            return await resolveMe(headers);
        case 'createPost':
            return await resolveCreatePost(input, headers);
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

        const userData = await login({getAllUsers})(input);

        const userDataWithJwt = Object.freeze({

            jwt: jwt(userData),

            ...userData
        });

        return createSuccessResponse(userDataWithJwt);


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

        // const post = await createPost({savePost, });




    } catch (err) {

        return createFailureResponse(err);
    }
}