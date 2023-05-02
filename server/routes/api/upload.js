const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Redéfinition des dimensions de l'image
const targetWidth = 300;
const targetHeight = 200;

app.post('/', upload.single('image'), async (req, res) => {
  try {
    const inputFilePath = req.file.path;
    const outputFileName = `compressed_${req.file.filename}.jpeg`;
    const outputFilePath = path.join(req.file.destination, outputFileName);

    await sharp(inputFilePath)
      .resize(targetWidth, targetHeight, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toFile(outputFilePath);

    fs.unlinkSync(inputFilePath); // Supprime le fichier d'origine

    res.status(200).json({
      message: 'Image uploaded, compressed, and resized successfully',
      compressedImageFile: outputFileName,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the image' });
  }
});
