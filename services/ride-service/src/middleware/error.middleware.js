const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Default error status and message
    let status = err.status || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        status = 400;
        message = err.message;
    } else if (err.name === 'CastError') {
        status = 400;
        message = 'Invalid ID format';
    } else if (err.name === 'JsonWebTokenError') {
        status = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        status = 401;
        message = 'Token expired';
    } else if (err.name === 'AxiosError') {
        // Handle errors from external service calls
        status = err.response?.status || 500;
        message = err.response?.data?.message || 'External service error';
    }

    // Send error response
    res.status(status).json({
        status: 'error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler; 