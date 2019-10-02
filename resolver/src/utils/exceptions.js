const exception = (message, def, code) => {

    const error = new Error(message ? message : def);

    error.code = code;

    return error

};

module.exports = {

    MissingRequiredFieldsException: (message) => exception(
        message,
        'Some required fields are missing',
        'MissingRequiredFieldsException'
    ),
    UserAlreadyExistsException: (message) => exception(
        message,
        'A user with the same email already exists',
        'UserAlreadyExistsException'
    ),
    InvalidEmailOrPasswordException: (message) => exception(
        message,
        'Invalid email or password',
        'InvalidEmailOrPassword'
    ),
    NoJWTException: (message) => exception(
        message,
        'No authentication token was provided',
        'NoJWTException'
    ), InvalidJWTException: (message) => exception(
        message,
        'The authentication token provided is not valid',
        'InvalidJWTException'
    )


};