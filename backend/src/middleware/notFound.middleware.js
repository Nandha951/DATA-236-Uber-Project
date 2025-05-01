const notFoundHandler = (req, res, next) => {
    console.log('=== 404 Not Found Debug ===');
    console.log(`Method: ${req.method}`);
    console.log(`Original URL: ${req.originalUrl}`);
    console.log(`Base URL: ${req.baseUrl}`);
    console.log(`Path: ${req.path}`);
    console.log('=========================');
    
    res.status(404).json({
        status: 'error',
        message: `Route ${req.originalUrl} not found`,
        debug: {
            method: req.method,
            originalUrl: req.originalUrl,
            baseUrl: req.baseUrl,
            path: req.path
        }
    });
};

module.exports = notFoundHandler; 