// routes/fileRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();

// Create upload folder if not exists
const uploadFolder = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Multer storage config (preserve original name)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// POST /api/files/upload
// router.post('/upload', upload.single('file'), (req, res) => {
//   if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//   const host = req.protocol + '://' + req.get('host');
//   const fileUrl = `${host}/uploads/${encodeURIComponent(req.file.originalname)}`;
//   res.status(200).json({ url: fileUrl });
// });

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const BASE_URL = process.env.BASE_URL || 'http://localhost:5400';
  // Hardcoded https base
  const fileUrl = `${BASE_URL}/uploads/${encodeURIComponent(req.file.originalname)}`;
  
  res.status(200).json({ url: fileUrl });
});


// GET /uploads/:filename (static, already handled in express.static)
module.exports = router;
