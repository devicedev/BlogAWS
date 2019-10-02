require('module-alias/register');

const jwt = require('@utils/jwt');

const {createSuccessResponse, createFailureResponse} = require('./utils/graphql/mutationResultFactory');

const {getAuthUser} = require('@utils/getAuthUser');

const {
    user: {register, login},


} = require('@usecases');

const {
    user: {saveUser, getUser, getAllUsers}
} = require('@repository');

exports.resolver = async ({field, arguments: {input}, headers}) => {

    switch (field) {

        case 'register':
            return await resolveRegister(input, headers);
        case 'login':
            return await resolveLogin(input, headers);
        case 'me':
            return await resolveMe(headers)
    }

};

async function resolveRegister(input, headers) {
    try {

        const userData = await register(saveUser, getAllUsers)(input);

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
async function resolve() {
    
}