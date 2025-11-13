// Datei: utils/tokenService.js
const jwt = require('jsonwebtoken');

// --- ERKLÄRUNG DER FUNKTION ---
// Wir definieren EINE Funktion, die alles rund um die Token-Erstellung managed.
// Sie erwartet die wichtigsten User-Infos als Input.
//
// WIRKUNGSWEISE:
// Diese Funktion ist ein "Service". Sie nimmt Daten entgegen (den User),
// wendet eine komplexe Regel an (JWT-Signierung) und gibt ein
// Ergebnis (den Token-String) zurück. Sie ist "dumm" und weiß nichts
// vom Login-Prozess selbst.
const generateToken = (user) => {

  // 1. Der "Inhalt" (Payload): Was soll im "Ausweis" stehen?
  //    Nur das Nötigste: Wer ist der User (ID) und was darf er (Rolle).
  //    NIEMALS Passwörter oder private Daten hier rein!
  const payload = {
    userId: user.id,
    role: user.role 
  };

  // 2. Das "Geheimnis" (Secret): Womit wird der Ausweis "versiegelt"?
  //    Dieser Wert MUSS aus der .env-Datei kommen.
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET ist nicht in der .env-Datei definiert!');
  }

  // 3. Die "Optionen" (Options): Wie lange ist der Ausweis gültig?
  const options = {
    expiresIn: '8h' // z.B. 8 Stunden. Nach 8h muss sich der User neu einloggen.
    // expiresIn: '7d' // oder 7 Tage.
  };

  // 4. Die "Signierung" (Das Erstellen)
  //
  // --- ERKLÄRUNG jwt.sign() ---
  // Das ist die Kernmethode aus dem 'jsonwebtoken'-Paket.
  //
  // WIRKUNGSWEISE (BEZOGEN AUFS BACKEND):
  // jwt.sign(payload, secret, options) nimmt die drei Teile
  // (Inhalt, Geheimnis, Optionen) und "verbackt" sie mathematisch
  // zu einem langen, kryptischen String (dem Token).
  //
  // Nur wer das 'secret' kennt, kann (a) prüfen, ob der Token echt ist,
  // und (b) den 'payload' wieder auslesen.
  const token = jwt.sign(payload, secret, options);

  return token;
};

// Wir "exportieren" die Funktion, damit andere Dateien (wie unsere Login-Route)
// sie importieren und benutzen können.
module.exports = {
  generateToken
};