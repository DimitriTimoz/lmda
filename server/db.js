const { Pool } = require('pg');
const env = require('dotenv').config( {path: './.env'} );
const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'lmda',
  password: env.DB_PASSWORD || 'password',
  port: 5432,
});

module.exports = pool;
