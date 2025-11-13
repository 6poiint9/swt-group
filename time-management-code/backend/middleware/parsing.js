// utils/parsing.js

/**
 * Validate username
 * - Only letters a-zA-Z
 * - Length 3-15
 */
function validateUsername(username) {
  if (typeof username !== 'string') return { ok: false, message: 'invalid login' };

  const clean = username.trim();

  if (clean.length < 3 || clean.length > 15) return { ok: false, message: 'invalid login' };
  if (!/^[A-Za-z]+$/.test(clean)) return { ok: false, message: 'invalid login' };

  return { ok: true, value: clean };
}

/**
 * Validate password
 * - Length 2-69 
 * - No control characters
 */
function validatePassword(password) {
  if (typeof password !== 'string') return { ok: false, message: 'invalid login' };

  if (password.length < 2 || password.length > 69) return { ok: false, message: 'invalid login' };
  if (/[\u0000-\u001F]/.test(password)) return { ok: false, message: 'invalid login' };

  return { ok: true, value: password };
}

module.exports = {
  validateUsername,
  validatePassword,
};

