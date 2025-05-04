const successResponse = (res, data, message = 'Success', status = 200) => {
    res.status(status).json({
        status: 'success',
        message,
        data
    });
};

const errorResponse = (res, message = 'Error', status = 500, error = null) => {
    res.status(status).json({
        status: 'error',
        message,
        ...(error && { error: error.message })
    });
};

const paginatedResponse = (res, data, pagination, message = 'Success') => {
    res.status(200).json({
        status: 'success',
        message,
        data,
        pagination
    });
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse
}; 