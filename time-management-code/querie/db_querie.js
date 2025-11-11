import { pool } from "./index.js";

/**
 * Holt alle Nutzer
 */
export async function getAllUsers() {
  const query = "SELECT id, username, email FROM users ORDER BY id ASC";
  console.log("[getAllUsers] SQL:", query);
  const { rows } = await pool.query(query);
  console.log("[getAllUsers] rows:", rows);
  return rows;
}

/**
 * Holt einen Nutzer nach Username
 */
export async function getUserByUsername(username) {
  const query = "SELECT id, email, username FROM users WHERE username = $1";
  console.log("[getUserByUsername] username:", username);
  const { rows } = await pool.query(query, [username]);
  console.log("[getUserByUsername] result:", rows[0]);
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
  console.log("[createUser] email:", email, "username:", username);
  const { rows } = await pool.query(query, [email, username, passwordHash]);
  console.log("[createUser] created:", rows[0]);
  return rows[0];
}

/**
 * Löscht einen Nutzer nach ID
 */
export async function deleteUserById(id) {
  const query = "DELETE FROM users WHERE id = $1 RETURNING id";
  console.log("[deleteUserById] id:", id);
  const { rows } = await pool.query(query, [id]);
  console.log("[deleteUserById] deleted:", rows[0]);
  return rows[0];
}

/**
 * Ändert das Passwort eines Nutzers anhand des Usernames
 */
export async function changePasswordByUsername(username, newPasswordHash) {
  const query = `
    UPDATE users
    SET password_hash = $1
    WHERE username = $2
    RETURNING id, username;
  `;
  console.log("[changePasswordByUsername] username:", username);
  const { rows } = await pool.query(query, [newPasswordHash, username]);
  console.log("[changePasswordByUsername] updated:", rows[0]);
  return rows[0] || null;
}

