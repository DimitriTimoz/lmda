const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
var router = require('express').Router();
const pool = require('../../db');
const upload = multer({ dest: 'uploads/' });
const { addImage } = require('../../database/images');

// Redifine the image resolution of an image and save it
router.post('/', upload.single('image'), async (req, res) => {
  // Check if the user is logged in
  if (!req.session.loggedin) {
    return res.status(401).json({ error: 'Vous devez être connecté pour envoyer une image.' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichié spécifié.' });
  }

  try {
    const inputFilePath = req.file.path;
    const outputFileName = `compressed_${req.file.filename}.jpeg`;

    let targetWidth = 0;
    let targetHeight = 0;

    // Get the utility of the image
    switch (req.body.utility) {
      case 'preview':
        targetWidth = 300;
        targetHeight = 400;
        break;
      default:
        targetWidth = 600;
        targetHeight = 800;
        break;
    };
    const outputFilePath = path.join(req.file.destination, outputFileName);

    await sharp(inputFilePath)
      .rotate()
      .resize(targetWidth, targetHeight, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toFile(outputFilePath);

    fs.unlinkSync(inputFilePath); 
      
    // Check if the file exists
    if (!fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath); 
      return res.status(500).json({ error: "Une erreur est apparue lors de l'ajout de l'image." });
    }

    let id = await addImage(req.session.uid, outputFileName);
    if (id == 0) {
      fs.unlinkSync(outputFilePath); 
      return res.status(500).json({ error: "Une erreur est apparue lors de l'ajout de l'image dans la base de donnée." });
    }
    res.status(200).json({
      message: 'Image uploaded, compressed, and resized successfully',
      id: id,
      compressedImageFile: outputFileName,
      success: true,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Une erreur est apparue lors de l'ajout de l'image." });
    fs.unlinkSync(outputFilePath); 
  }
});


module.exports = router;
