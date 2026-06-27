const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer storage for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'img-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// POST /api/upload - Upload raw image to server
router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image provided' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ 
            message: 'Image uploaded successfully', 
            url: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/save - Save the customized wallpaper from Canvas (Base64)
router.post('/save', (req, res) => {
    try {
        const { imageData } = req.body; // Expecting base64 string from frontend Canvas
        if (!imageData) {
            return res.status(400).json({ error: 'No image data provided' });
        }

        // Remove header from base64 string
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');

        const filename = 'wallpaper-' + Date.now() + '.png';
        const filepath = path.join(__dirname, '../uploads', filename);

        fs.writeFile(filepath, buffer, (err) => {
            if (err) {
                console.error('Error saving file:', err);
                return res.status(500).json({ error: 'Failed to save wallpaper' });
            }
            res.json({
                message: 'Wallpaper saved successfully',
                url: `/uploads/${filename}`
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/wallpapers - List all saved/uploaded wallpapers
router.get('/wallpapers', (req, res) => {
    const uploadsDir = path.join(__dirname, '../uploads');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadsDir)) {
        return res.json({ images: [] });
    }

    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read directory' });
        }
        
        const images = files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => {
                const stat = fs.statSync(path.join(uploadsDir, file));
                return {
                    filename: file,
                    url: `/uploads/${file}`,
                    createdAt: stat.mtime
                };
            })
            .sort((a, b) => b.createdAt - a.createdAt); // Newest first

        res.json({ images });
    });
});

module.exports = router;
