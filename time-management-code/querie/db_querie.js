import { pool } from "./index.js";

//######return Ausgaben hinter jeder funktion########
/**
 * Holt alle Nutzer
 */
export async function getAllUsers() { // { id: '11', username: 'testuser', email: 'test@example.com' }, { id: '14', username: 'testuser2', email: 'test2@example.com' }
  const query = "SELECT id, username, email FROM users ORDER BY id ASC";
  console.log("[getAllUsers] SQL:", query);
  const { rows } = await pool.query(query);
  console.log("[getAllUsers] rows:", rows);
  return rows[0];
}

/**
 * Holt einen Nutzer nach Username
 */
export async function getUserByUsername(username) { //{ id: '11', email: 'test@example.com', username: 'testuser' }
  const query = "SELECT id, email, username FROM users WHERE username = $1";
  console.log("[getUserByUsername] username:", username);
  const { rows } = await pool.query(query, [username]);
  console.log("[getUserByUsername] result:", rows[0]);
  return rows[0] || null;
}

/**
 * Fügt einen neuen Nutzer hinzu
 */
export async function createUser(email, username, passwordHash) { //{ id: '17', email: 'test3@example.com', username: 'testuser3' }
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
export async function deleteUserById(id) { // { id: '17' }
  const query = "DELETE FROM users WHERE id = $1 RETURNING id";
  console.log("[deleteUserById] id:", id);
  const { rows } = await pool.query(query, [id]);
  console.log("[deleteUserById] deleted:", rows[0]);
  return rows[0];
}

/**
 * Ändert das Passwort eines Nutzers anhand des Usernames
 */
export async function changePasswordByUsername(username, newPasswordHash) { // { id: '11', username: 'testuser' }
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

/**
 * Holt ID und Passwort-Hash anhand des Usernames
 */
export async function getUserIdAndPasswordByUsername(username) { // { id: '11', password_hash: 'newHash456' }
  const query = `
    SELECT id, password_hash
    FROM users
    WHERE username = $1
  `;
  console.log("[getUserIdAndPasswordByUsername] username:", username);
  const { rows } = await pool.query(query, [username]);
  console.log("[getUserIdAndPasswordByUsername] result:", rows[0]);
  return rows[0] || null;
}
