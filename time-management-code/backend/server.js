// 1. Express importieren (den "Werkzeugkasten" holen)
const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/authenticateuser');
const changePwRoutes = require('./routes/changePassword');
const myViewRoutes = require('./routes/myview');
const cors = require('cors'); // Wichtig für die Frontend-Verbindung


// 2. Eine "App" aus Express erstellen (den Server initialisieren)
const app = express();

// 3. Den Port definieren (eine "Türnummer", auf der der Server lauscht)
const port = 3001; // 3000 ist oft von React belegt, daher 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use('/api/authenticateUser', authRoutes);

// Jede Anfrage an /api/user/... soll an den passwordRoutes-Router gehen
app.use('/api/changePassword', changePwRoutes); 

// Jede Anfrage an /api/view/... soll an den myViewRoutes-Router gehen
app.use('/api/myView', myViewRoutes);

// 5. Den Server starten und auf dem Port "lauschen"
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});


/*
// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

app.get('/', (req, res) => res.send('API running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

 */
