const pool = require('../db');
const fs = require('fs');
const path = require('path');

async function getImage(id, author) {
    if (isNaN(id)) {
        return [];
    }
    try {
        const query = `
            SELECT * FROM images
            WHERE id = $1 AND author = $2
        `;
        const { rows } = await pool.query(query, [id, author]);
        
        if (rows.length == 0) {
            return [];
        }
        return rows[0];
    } catch (error) {
        console.error('Error getting image:', error.message);
        return []
    }
}

async function getImages(author) {
    try {
        const query = `
            SELECT * FROM images
            WHERE author = $1
        `;
        const { rows } = await pool.query(query, [author]);
        return rows;
    } catch (error) {
        console.error('Error getting images:', error.message);
        return []
    }
}


async function addImage(admin_id, filename) {
    const query = 'INSERT INTO images (author, filename) VALUES ($1, $2) RETURNING id';
    const values = [admin_id, filename];
  
    try {
      let result = await pool.query(query, values);
      return result.rows[0].id;
    } catch (error) {
      console.error('Error:', error);
      return 0;
    }
}

async function deleteImage(id, author) {
    if (isNaN(id)) {
        return false;
    }
    try {
        // Get the filename
        const queryGetFilename = `
            SELECT filename FROM images
            WHERE id = $1 AND author = $2
        `;
        const { rows } = await pool.query(queryGetFilename, [id, author]);
        if (rows.length == 0) {
            return false;
        }
        const filename = rows[0].filename;

        // Delete the file
        const filePath = path.join(__dirname, '../uploads', filename);
        fs.unlinkSync(filePath);

        // Delete the entry in the database
        const query = `
            DELETE FROM images
            WHERE id = $1 AND author = $2
        `;
        await pool.query(query, [id, author]);
        return true;
    } catch (error) {
        console.error('Error deleting image:', error.message);
        return false;
    }
}

async function linkImage(id, author) {
    // Check id and author are numbers
    if (isNaN(id)) {
        return false;
    }

    try {
        const query = `
            UPDATE images
            SET linked = true
            WHERE id = $1 AND author = $2
        `;
        await pool.query(query, [id, author]);
        return true;
    } catch (error) {
        console.error('Error linking image:', error.message);
        return false;
    }
}

module.exports = {
    getImage,
    getImages,
    addImage,
    linkImage,
    deleteImage
};