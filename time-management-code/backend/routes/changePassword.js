// Korrekter Import (obwohl wir ihn hier nicht direkt brauchen)
const Parser = require('../middleware/parsing');
const express = require('express');
const router = express.Router();
const User = require('../querie/db_querie');
const authservice = require('../utils/validatePwd');
const changePassword = require('../utils/changePwService'); // <-- Name ist 'changePassword'

// KORREKTE ROUTEN-SYNTAX:
// router.post('pfad', [optinale_middleware], async (req, res) => { ... })
// Wir lassen 'Parser' weg, da es keine Middleware ist.
router.post('/changepassword', async (req, res) => {
    try {
        const { username, oldPassword, newPasswordOne, newPasswordTwo } = req.body;

        // 1. Altes Passwort validieren
        // (Wir nehmen an, authservice.validatePassword wirft bei Fehler einen Error)
        // HINWEIS: Du hast 'validatePassword' in 'validatePwd.js'[cite: 15], 
        // aber in der Vorrunde haben wir es 'validatePasswordAndGetUser' genannt.
        // Ich gehe davon aus, dass 'validatePassword' die Funktion ist, die wir
        // in Schritt 3 der Vorrunde repariert haben.
        await authservice.validatePasswordAndGetUser(username, oldPassword);

        // 2. Neue Passwörter vergleichen
        if (newPasswordOne !== newPasswordTwo) {
            return res.status(400).json({ message: "Die Beiden neuen Passwörter stimmen nicht überein." });
        }

        // 3. Passwortlänge prüfen (KORRIGIERT)
        if (newPasswordOne.length < 10) {
            return res.status(400).json({ message: "Passwortrichtlinie nicht eingehalten!" });
        }

        // 4. Passwort ändern (Service-Aufruf)
        // Wir rufen den Service mit 'username' auf, wie von dir gewünscht.
        const changed = await changePassword.changePassword(username, newPasswordOne);

        if (changed) {
            return res.status(200).json({ message: "Passwort erfolgreich geändert!" });
        } else {
            return res.status(500).json({ message: "Fehler beim Ändern des Passworts." });
        }

    } catch (error) {
        // Fängt den Fehler von 'validatePassword', falls das alte PW falsch war
        return res.status(401).json({ message: error.message });
    }
});

module.exports = router;