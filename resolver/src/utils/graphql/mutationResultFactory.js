module.exports = {

    createSuccessResponse: (data) => ({
        data,
        success: true,
        error: null
    }),
    createFailureresponse: (err) => ({
        data: null,
        success: false,
        error: {
            code: err.code,
            message: err.message
        }
    })

};