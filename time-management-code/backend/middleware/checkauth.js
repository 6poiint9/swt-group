// Datei: middleware/checkAuth.js
const jwt = require('jsonwebtoken');

// --- ERKLÄRUNG EINER MIDDLEWARE ---
// Eine Middleware in Express ist eine Funktion, die 3 Argumente hat:
// 1. req (Request): Die ankommende Anfrage.
// 2. res (Response): Die ausgehende Antwort.
// 3. next (Next): Eine Funktion, die "den Nächsten bitte" ruft.
//
// WIRKUNGSWEISE:
// Sie stellt sich *zwischen* die Anfrage und den eigentlichen Endpunkt
// (z.B. "hole Arbeitszeiten"). Sie ist der "Türsteher".
const checkAuth = (req, res, next) => {
  try {
    // 1. "Zeig mir deinen Ausweis"
    //    Der Client (Frontend) MUSS den Token im Header mitschicken.
    //    Standard ist: "Authorization: Bearer DEIN_TOKEN_STRING"
    const token = req.headers.authorization.split(' ')[1]; // Holt den Token-Teil

    if (!token) {
      throw new Error('Kein Token gefunden');
    }

    // 2. "Ich prüfe den Ausweis"
    //
    // --- ERKLÄRUNG jwt.verify() ---
    // Das ist das Gegenstück zu jwt.sign().
    // Es nimmt den Token und das (gleiche!) Secret.
    //
    // WIRKUNGSWEISE (BEZOGEN AUFS BACKEND):
    // Es macht ZWEI Prüfungen:
    // a) Ist die Signatur gültig? (Wurde der Token mit unserem Secret erstellt?)
    // b) Ist das Ablaufdatum (expiresIn) noch nicht erreicht?
    //
    // Wenn beides "Ja" ist, gibt es den originalen 'payload' zurück.
    // Wenn nicht, wirft es einen Fehler (den wir im 'catch' fangen).
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // 3. (WICHTIG!) "Okay, du bist es. Hier ist dein VIP-Pass."
    //    Wir hängen die entschlüsselten Daten (den Payload) an das
    //    Request-Objekt.
    //
    // WIRKUNGSWEISE (IMPAKT):
    // JEDE Route, die *nach* dieser Middleware aufgerufen wird,
    // hat jetzt Zugriff auf `req.userData`. Die Route "weiß" also,
    // wer der anfragende User ist (z.B. { userId: 12, role: 'Supervisor' }),
    // ohne dass die Route selbst in die Datenbank schauen muss.
    req.userData = { userId: decodedToken.userId, role: decodedToken.role };

    // 4. "Du darfst passieren."
    //    next() ruft die NÄCHSTE Funktion in der Kette auf
    //    (also den eigentlichen Endpunkt, z.B. "hole Arbeitszeiten").
    //    WIRD next() NICHT GERUFEN, BLEIBT DER REQUEST HÄNGEN!
    next();

  } catch (error) {
    // 5. "Dein Ausweis ist gefälscht/abgelaufen. Zugriff verweigert."
    //    Statt next() rufen wir res.status() und beenden die Anfrage.
    return res.status(401).json({
      message: 'Authentifizierung fehlgeschlagen.'
    });
  }
};

module.exports = checkAuth;