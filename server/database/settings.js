const pool = require('../db');

async function getSetting(name) {
    try {
        const result = await pool.query('SELECT * FROM settings WHERE name = $1', [name]);
        if (result.rows.length === 0) {
            return null;
        }
        return result.rows[0].value;
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {
    getSetting
}
