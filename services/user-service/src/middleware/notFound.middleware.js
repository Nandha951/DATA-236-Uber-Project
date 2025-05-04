const notFoundHandler = (req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.method} ${req.url} not found`
    });
};

module.exports = notFoundHandler; 