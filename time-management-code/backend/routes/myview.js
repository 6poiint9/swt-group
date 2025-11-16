// Datei: routes/myview.js
const checkAuth = require('../middleware/checkauth');

const express = require('express');

// Erstelle einen neuen, mini-Express-Router
// Stell dir 'router' als eine kleine, unabhängige Express-App vor.
const router = express.Router();

// (Hier kommen gleich unsere Endpunkte hin)
router.get('/', checkAuth, (req, res) => {
  try {
    // --- HIER IST DER ZUGRIFF ---
    // Du kannst jetzt direkt auf req.userData zugreifen,
    // weil die checkAuth-Middleware es bereits angehängt hat.
    const userId = req.userData.userId;
    const userRole = req.userData.role;
    // Du kannst die Infos direkt zurücksenden:
    if (userRole === 'supervisor') {
      // --- Logik NUR für Supervisoren ---
      // (z.B. Datenbankabfrage für alle Teammitglieder)
    return  res.status(200).json({
        message: "Team-Übersicht für Supervisor",
        teamData: ["Hans", "Greta", "Lukas"] // Beispiel-Daten
      });
    }
     if (userRole === 'hr') {
      // --- Logik NUR für Supervisoren ---
      // (z.B. Datenbankabfrage für alle Teammitglieder)
      return res.status(200).json({
        message: "Allgemeine Übersicht für HR",
        teamData: ["Anna", "Bernd", "Clara","Entwicklung", "Marketing"] // Beispiel-Daten
      });
    }
     if (userRole === 'employee') {
      // --- Logik NUR für Supervisoren ---
      // (z.B. Datenbankabfrage für alle Teammitglieder)
      return  res.status(200).json({
        message: "Standard-Übersicht für Mitarbeiter",
        teamData: ["I am just a guy"]
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Serverfehler' });
  }
});

// Am Ende der Datei müssen wir den Router exportieren,
// damit unsere Haupt-Datei (server.js) ihn finden kann.
module.exports = router;
