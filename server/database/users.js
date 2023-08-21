
const bcrypt = require('bcryptjs');
const pool = require("../db");
const env = require('dotenv').config({path: './.env'}).parsed;

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

async function getEmail(uid) {
  try {
    const query = `
      SELECT email FROM users
      WHERE id = $1;
    `;
    const { rows } = await pool.query(query, [uid]);
    if (rows.length === 0) {
      return false;
    }
    return rows[0].email;
  } catch (error) {
    console.error('Error getting user email:', error.message);
  }
}

async function getName(uid) {
  try {
    const query = `
      SELECT name FROM users
      WHERE id = $1;
    `;
    const { rows } = await pool.query(query, [uid]);
    return rows;
  } catch (error) {
    console.error('Error getting user name:', error.message);
    throw error;
  }
}


async function changePassword(email, password, newPassword) {
  try {
    const query = `
      SELECT password FROM admins
      WHERE email = $1;
    `;
    const { rows } = await pool.query(query, [email]);
    if (rows.length === 0) {
      return false;
    }

    const result = await comparePassword(password, rows[0].password);
    if (result) {
      const hashedPassword = await hashPassword(newPassword);
      const query = `
        UPDATE admins
        SET password = $1
        WHERE email = $2;
      `;
      await pool.query(query, [hashedPassword, email]);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error changing password:', error.message);
    throw error;
  }
}

function getAdminEmails() {
  return env.ADMIN_IDS.split(',');
}

module.exports = {
    hashPassword,
    comparePassword,
    addAdmin,
    getUser,
    getEmail, 
    changePassword,
    getAdminEmails,
    getName
};

