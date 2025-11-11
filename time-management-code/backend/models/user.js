// models/user.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // optionally: ssl: { rejectUnauthorized: false } for some hosted DBs
});

async function init() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createTableQuery);
}
init().catch(err => console.error('DB init error:', err));

const User = {
  create: async (email, hashedPassword) => {
    const q = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email;`;
    const values = [email, hashedPassword];
    const res = await pool.query(q, values);
    return res.rows[0];
  },

  findByEmail: async (email) => {
    const q = `SELECT id, email, password FROM users WHERE email = $1;`;
    const res = await pool.query(q, [email]);
    return res.rows[0] || null;
  }
};

module.exports = User;



