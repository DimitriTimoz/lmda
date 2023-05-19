
const bcrypt = require('bcryptjs');
const pool = require("../db");

async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
}

// compare password
async function comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
}
    
async function addAdmin(email, password) {
    try {
      const hashedPassword = await hashPassword(password);
      const query = `
        INSERT INTO admins (email, password)
        VALUES ($1, $2)
        RETURNING id, email;
      `;
  
      const { rows } = await pool.query(query, [email, hashedPassword]);
      console.log('Admin added:', rows[0]);
    } catch (error) {
      console.error('Error adding admin:', error.message);
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    addAdmin
};

