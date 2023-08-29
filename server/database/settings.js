const pool = require('../db');

async function getSetting(name) {
    try {
        const rows = await pool.query('SELECT * FROM settings WHERE name = $1', [name]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0].value;
    } catch (err) {
        console.error(err);
        return null;
    }
}

module.exports = {
    getSetting
}
