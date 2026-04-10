const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const { protect, adminOnly } = require('../middleware/auth');

// Local storage (switch to Cloudinary in production)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`),
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error('Only images are allowed!'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, url, public_id: req.file.filename });
});

router.post('/multiple', protect, adminOnly, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0)
    return res.status(400).json({ success: false, message: 'No files uploaded' });
  const images = req.files.map((f) => ({
    url: `${req.protocol}://${req.get('host')}/uploads/${f.filename}`,
    public_id: f.filename,
  }));
  res.json({ success: true, images });
});

module.exports = router;
