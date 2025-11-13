const { Pool } = require("pg");
// 2. Ersetze 'import dotenv from "dotenv"'
const dotenv = require("dotenv");

// 3. Lade die .env-Variablen (wird auch in server.js gemacht, aber schadet hier nicht)
dotenv.config();

// 4. Die ungültigen Zeilen (DATABASE_URL=... und PORT=...) werden entfernt
//    Sie gehören in die .env-Datei, nicht hierher.

// 5. Erstelle den Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 6. Ersetze 'export const pool' durch 'module.exports'
module.exports = {
  pool
};
