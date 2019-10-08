const exception = (message, def, code) => {
    const error = new Error(message ? message : def);

    error.code = code;

    return error;
};

module.exports = {
    UserValidationException: message =>
        exception(
            message,
            "The validation of the user failed",
            "UserValidationException"
        ),
    UserAlreadyExistsException: message =>
        exception(
            message,
            "A user with the same email already exists",
            "UserAlreadyExistsException"
        ),
    InvalidEmailOrPasswordException: message =>
        exception(
            message,
            "Invalid email or password",
            "InvalidEmailOrPassword"
        ),
    NoJWTException: message =>
        exception(
            message,
            "No authentication token was provided",
            "NoJWTException"
        ),
    InvalidJWTException: message =>
        exception(
            message,
            "The authentication token provided is not valid",
            "InvalidJWTException"
        ),
    PostValidationException: message =>
        exception(
            message,
            "The validation of the post failed",
            "PostValidationException"
        ),
    PostNotFoundException: message =>
        exception(message, "Post not found", "PostNotFoundException"),

    UserHasNoAccessToPostException: message =>
        exception(
            message,
            "You don't have access to the given post",
            "UserHasNoAccessToPostException"
        )
};
