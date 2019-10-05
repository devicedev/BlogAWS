module.exports = {

    createSuccessResponse: (data) => ({
        data,
        success: true,
        error: null
    }),
    createFailureResponse: (err) => ({
        data: null,
        success: false,
        error: {
            code: err.code,
            message: err.message
        }
    })

};