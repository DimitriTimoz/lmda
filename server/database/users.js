
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
        RETURNING id, email, password;
      `;
  
      const { rows } = await pool.query(query, [email, hashedPassword]);
      console.log('Admin added:', rows[0].email);
      return rows[0];
    } catch (error) {
      console.error('Error adding admin:', error.message);
      throw error;
    }
}

async function getUser(uid) {
  try {
    const query = `
      SELECT * FROM users
      WHERE id = $1;
    `;
    const { rows } = await pool.query(query, [uid]);
    return rows;
  } catch (error) {
    console.error('Error getting user:', error.message);
    throw error;
  }
}

module.exports = {
    hashPassword,
    comparePassword,
    addAdmin,
    getUser,
};

