const { pool } = require("./index.js");

//######return Ausgaben hinter jeder funktion########
/**
 * Holt alle Nutzer
 */
async function getAllUsers() {
  const query = "SELECT id, username, email FROM users ORDER BY id ASC";
  console.log("[getAllUsers] SQL:", query);
  const { rows } = await pool.query(query);
  console.log("[getAllUsers] rows:", rows);
  return rows;
}

/**
 * Holt einen Nutzer nach Username
 */
async function getUserByUsername(username) {
  // --- KORREKTUR (Blocker #4) ---
  // Wir MÜSSEN das Passwort-Hash mit abrufen.
  // WICHTIG: Wir nutzen 'AS password', damit das Feld 'password' heißt.
  //          Das ist der Name, den 'utils/validatePwd.js' erwartet!
  const query = "SELECT id, email, username, rolename, password_hash AS password FROM users WHERE username = $1";
  console.log("[getUserByUsername] username:", username);
  const { rows } = await pool.query(query, [username]);
  console.log("[getUserByUsername] result:", rows[0]);
  return rows[0] || null;
}

/**
 * Fügt einen neuen Nutzer hinzu
 */
async function createUser(email, username, passwordHash, rolename = "employee") {
  const query = `
    INSERT INTO users (email, username, password_hash, rolename)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, username, rolename;
  `;
  console.log("[createUser] email:", email, "username:", username, "rolename:", rolename);
  const { rows } = await pool.query(query, [email, username, passwordHash, rolename]);
  console.log("[createUser] created:", rows[0]);
  return rows[0];
}

/**
 * Löscht einen Nutzer nach ID
 */
async function deleteUserById(id) {
  const query = "DELETE FROM users WHERE id = $1 RETURNING id";
  console.log("[deleteUserById] id:", id);
  const { rows } = await pool.query(query, [id]);
  console.log("[deleteUserById] deleted:", rows[0]);
  return rows[0];
}

/**
 * Ändert das Passwort eines Nutzers anhand des Usernames
 */
async function changePasswordByUsername(username, newPasswordHash) {
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
async function getUserIdAndPasswordByUsername(username) { // { id: '11', password_hash: 'newHash456' }
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


//---------rolename Möglichkeiten: employee, hr, supervisor
async function getRoleByUsername(username) { // {id: '1', username: 'dummy', role: "employee" | "supervisor" | "hr"}
  const query = `
    SELECT id, username, rolename
    FROM users
    WHERE username = $1
  `;
  console.log("[getRoleByUsername] username:", username);

  const { rows } = await pool.query(query, [username]);

  console.log("[getRoleByUsername] result:", rows[0]);
  return rows[0] || null;
}


module.exports = {
  getAllUsers,
  getUserByUsername,
  createUser,
  deleteUserById,
  changePasswordByUsername,
  getUserIdAndPasswordByUsername,
  getRoleByUsername
};
