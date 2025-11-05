// 1. Express importieren (den "Werkzeugkasten" holen)
const express = require('express');

// 2. Eine "App" aus Express erstellen (den Server initialisieren)
const app = express();

// 3. Den Port definieren (eine "Türnummer", auf der der Server lauscht)
const port = 3001; // 3000 ist oft von React belegt, daher 3001

// 4. Eine simple Test-Route definieren
// Wenn jemand die Haupt-URL (/) aufruft, antworte mit "Hallo Welt"
app.get('/', (req, res) => {
  res.send('Hallo Welt! Der Server läuft. Vorerst.');
});

// 5. Den Server starten und auf dem Port "lauschen"
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});