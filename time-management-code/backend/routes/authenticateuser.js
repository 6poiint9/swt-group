// routes/authenticateuser.js
const express = require('express');
const router = express.Router();
// Wir importieren unseren Service, nicht 'user' oder 'argon' direkt
const authservice = require('../utils/validatePwd'); 
const createToken = require('../utils/createToken');
// parsInput wird hier nicht als Middleware genutzt, sondern seine Funktionen
// werden *indirekt* über den authservice aufgerufen.

// POST /api/authenticateUser/login (gemäß server.js)
router.post('/login', async (req, res) => {
  // Ein try...catch-Block ist entscheidend, um die Fehler
  // von authservice.validatePasswordAndGetUser zu fangen.
  try {
    const { username, password } = req.body;
    
    // 1. Rufe den Service auf. Er wirft entweder einen Fehler oder gibt den User zurück.
    const user = await authservice.validatePasswordAndGetUser(username, password);

    // 2. Erfolg! (Wenn wir hier ankommen, war die Validierung erfolgreich)
    //    'user' ist jetzt das Objekt, das der Service zurückgegeben hat.
    const token = createToken.generateToken(user);
    
    // 3. Sende die Erfolgs-Antwort (HTTP 200)
    res.json({ success: true, token, username: user.username });

  } catch (err) {
    // 4. Fehler! (z.B. 'invalid login' vom Service)
    //    Hier sendet die ROUTE den 401-Status, nicht der Service.
    console.error('Login error:', err.message);
    res.status(401).json({ success: false, message: 'invalid login' });
  }
});

module.exports = router;