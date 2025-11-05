import { pool } from "./index.js";

/**
 * Holt alle Nutzer
 */
export async function getAllUsers() {
  const query = "SELECT id, username, email FROM users ORDER BY id ASC";
  const { rows } = await pool.query(query);
  return rows;
}

/**
 * Holt einen Nutzer nach Username
 */
export async function getUserByUsername(username) {
  const query = "SELECT id, email, username FROM users WHERE username = $1";
  const { rows } = await pool.query(query, [username]);
  return rows[0] || null;
}

/**
 * Fügt einen neuen Nutzer hinzu
 */
export async function createUser(email, username, passwordHash) {
  const query = `
    INSERT INTO users (email, username, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, email, username;
  `;
  const { rows } = await pool.query(query, [email, username, passwordHash]);
  return rows[0];
}

/**
 * Löscht einen Nutzer nach ID
 */
export async function deleteUserById(id) {
  const query = "DELETE FROM users WHERE id = $1 RETURNING id";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
}
