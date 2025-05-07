const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let bucket;

// Initialize GridFS bucket
const initGridFS = () => {
    const db = mongoose.connection.db;
    bucket = new GridFSBucket(db, {
        bucketName: 'driverImages'
    });
    console.log('GridFS bucket initialized');
};

// Upload file to GridFS
const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
        try {
            if (!file || !file.buffer) {
                throw new Error('No file buffer provided');
            }

            console.log('Starting file upload:', {
                filename: file.originalname,
                size: file.buffer.length,
                mimetype: file.mimetype
            });

            const uploadStream = bucket.openUploadStream(file.originalname, {
                metadata: {
                    contentType: file.mimetype
                }
            });

            uploadStream.on('error', (error) => {
                console.error('Upload stream error:', error);
                reject(error);
            });

            uploadStream.on('finish', () => {
                console.log('File uploaded successfully:', {
                    id: uploadStream.id,
                    filename: file.originalname,
                    size: file.buffer.length
                });
                resolve(uploadStream.id);
            });

            // Write the buffer to the stream
            uploadStream.write(file.buffer);
            uploadStream.end();
        } catch (error) {
            console.error('Error in uploadFile:', error);
            reject(error);
        }
    });
};

// Get file from GridFS
const getFile = async (fileId) => {
    try {
        if (!fileId) {
            console.log('No fileId provided to getFile');
            return null;
        }
        const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        if (files.length === 0) {
            console.log('No file found with id:', fileId);
            return null;
        }
        console.log('File found:', {
            id: files[0]._id,
            filename: files[0].filename,
            size: files[0].length
        });
        return files[0];
    } catch (error) {
        console.error('Error getting file:', error);
        return null;
    }
};

// Get file data as buffer
const getFileData = async (fileId) => {
    try {
        if (!fileId) {
            console.log('No fileId provided to getFileData');
            return null;
        }

        const chunks = [];
        return new Promise((resolve, reject) => {
            const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

            downloadStream.on('data', (chunk) => {
                chunks.push(chunk);
            });

            downloadStream.on('error', (error) => {
                console.error('Download stream error:', error);
                reject(error);
            });

            downloadStream.on('end', () => {
                const buffer = Buffer.concat(chunks);
                console.log('File data retrieved:', {
                    id: fileId,
                    size: buffer.length
                });
                resolve(buffer);
            });
        });
    } catch (error) {
        console.error('Error getting file data:', error);
        return null;
    }
};

// Delete file from GridFS
const deleteFile = async (fileId) => {
    try {
        if (!fileId) {
            console.log('No fileId provided to deleteFile');
            return;
        }

        // Check if file exists before attempting to delete
        const file = await getFile(fileId);
        if (!file) {
            console.log('File not found for deletion:', fileId);
            return; // Return silently if file doesn't exist
        }

        await bucket.delete(new mongoose.Types.ObjectId(fileId));
        console.log('File deleted successfully:', fileId);
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error; // Throw the error to handle it in the route
    }
};

module.exports = {
    initGridFS,
    uploadFile,
    getFile,
    getFileData,
    deleteFile,
    bucket
}; 