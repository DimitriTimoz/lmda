const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
var router = require('express').Router();
const pool = require('../../db');
const upload = multer({ dest: 'uploads/' });

// Redéfinition des dimensions de l'image

async function addImage(admin_id, filename) {
  const query = 'INSERT INTO images (author, filename) VALUES ($1, $2)';
  const values = [admin_id, filename];

  try {
    await pool.query(query, values);
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

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

    let targetWidth = 300;
    let targetHeight = 200;

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
      .resize(targetWidth, targetHeight, { fit: 'fill' })
      .jpeg({ quality: 80 })
      .toFile(outputFilePath);

    fs.unlinkSync(inputFilePath); 

    
      
    // Check if the file exists
    if (!fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath); 
      return res.status(500).json({ error: "Une erreur est apparue lors de l'ajout de l'image." });
    }

    let success = await addImage(req.session.id, outputFileName);
    if (!success) {
      fs.unlinkSync(outputFilePath); 
      return res.status(500).json({ error: "Une erreur est apparue lors de l'ajout de l'image dans la base de donnée." });
    }

    res.status(200).json({
      message: 'Image uploaded, compressed, and resized successfully',
      compressedImageFile: outputFileName,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Une erreur est apparue lors de l'ajout de l'image." });
    fs.unlinkSync(outputFilePath); 
  }
});


module.exports = router;
