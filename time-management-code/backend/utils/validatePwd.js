const argon2 = require('argon2');
const User = require('../querie/db_querie.js');
const { validateUsername, validatePassword } = require('../middleware/parsing.js'); // Importiert die Parser-Funktionen

const validatePasswordAndGetUser = async (username, password) => {
  // 1. Eingaben validieren (mit den importierten Funktionen)
  const uCheck = validateUsername(username);
  const pCheck = validatePassword(password);

  if (!uCheck.ok || !pCheck.ok) {
    // Statt res.status, werfen wir einen Fehler, den die Route fangen kann
    throw new Error('invalid login');
  }

  // 2. User in der DB suchen (aus ../querie/db_querie)
  const user = await User.getUserByUsername(uCheck.value);
  if (!user) {
    throw new Error('invalid login');
  }

  // 3. Passwort verifizieren
  // HINWEIS: Das wird fehlschlagen, bis wir Blocker #4 (db_querie) beheben.
  // Die db_querie MUSS password_hash mitliefern, damit 'user.password' funktioniert.
  // Wir nehmen an, dass das Feld in der DB 'password_hash' heißt, aber das Objekt 'user.password' zurückgibt.
  const valid = await argon2.verify(user.password, pCheck.value); // Annahme: user.password enthält den Hash
  
  if (!valid) {
    throw new Error('invalid login');
  }

  // 4. Erfolg! Gib den User zurück, NICHT true/false.
  //    Die Route braucht den User, um den Token zu erstellen.
  return user; 
};

module.exports = {
  validatePasswordAndGetUser // Umbenannt für Klarheit
};