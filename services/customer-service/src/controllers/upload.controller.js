const multer = require('multer');
const path = require('path');

// Set up storage config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `ride-${req.params.rideId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

exports.uploadMiddleware = upload.single('image');

exports.uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image provided' });

  res.status(200).json({ message: 'Image uploaded', path: req.file.path });
};
