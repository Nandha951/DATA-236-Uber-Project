const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    console.log('Processing file:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        fieldname: file.fieldname
    });

    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        console.error('Invalid file type:', file.mimetype);
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure multer upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('profileImage');

// Wrap multer middleware to handle errors
const uploadMiddleware = (req, res, next) => {
    console.log('Upload middleware called with request:', {
        method: req.method,
        path: req.path,
        headers: {
            'content-type': req.headers['content-type'],
            'content-length': req.headers['content-length']
        }
    });

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', {
                code: err.code,
                message: err.message,
                field: err.field
            });
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    status: 'error',
                    message: 'File size too large. Maximum size is 5MB'
                });
            }
            return res.status(400).json({
                status: 'error',
                message: err.message
            });
        } else if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({
                status: 'error',
                message: err.message
            });
        }

        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({
                status: 'error',
                message: 'No file uploaded'
            });
        }

        console.log('File processed successfully:', {
            hasFile: true,
            fileDetails: {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                bufferLength: req.file.buffer.length,
                fieldname: req.file.fieldname
            }
        });

        // Verify the file buffer
        if (!req.file.buffer || req.file.buffer.length === 0) {
            console.error('Invalid file buffer');
            return res.status(400).json({
                status: 'error',
                message: 'Invalid file data'
            });
        }

        next();
    });
};

module.exports = uploadMiddleware; 