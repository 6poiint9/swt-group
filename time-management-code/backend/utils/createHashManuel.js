const argon2 = require('argon2');

// -------- HIER DAS PASSWORT EINGEBEN --------
// Gib hier das 'Startpasswort' ein, das du hashen möchtest
const passwordToHash = '1234567890'; 
// ------------------------------------------

const createHash = async () => {
  if (!passwordToHash) {
    console.error('Fehler: Bitte gib ein Passwort in der Variable "passwordToHash" an.');
    return;
  }

  try {
    console.log(`Erzeuge Hash für: "${passwordToHash}" ...`);
    
    // Verwendet die exakt gleichen Standard-Einstellungen wie dein restlicher Code
    const hash = await argon2.hash(passwordToHash); 
    
    console.log('---');
    console.log('Kopiere diesen Hash in deine Datenbank (password_hash Spalte):');
    console.log(hash); // Das ist der String für deine DB
  
  } catch (err) {
    console.error('Fehler beim Hashen:', err);
  }
};

// Skript ausführen
createHash();