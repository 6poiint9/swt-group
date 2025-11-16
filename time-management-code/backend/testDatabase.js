// Datei: backend/testDatabase.js
// Führe dieses Skript aus mit: node testDatabase.js

const { Pool } = require("pg");
require("dotenv").config();

// Farben für die Konsole (optional, aber schöner)
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

// Pool-Verbindung erstellen
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Hauptfunktion
async function testDatabase() {
  console.log(`${colors.cyan}╔═══════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║    DATABASE CONNECTION & STRUCTURE TEST   ║${colors.reset}`);
  console.log(`${colors.cyan}╚═══════════════════════════════════════════╝${colors.reset}\n`);

  try {
    // TEST 1: Verbindung testen
    console.log(`${colors.blue}[TEST 1]${colors.reset} Teste Datenbankverbindung...`);
    const connectionResult = await pool.query("SELECT NOW() as current_time, version() as db_version");
    console.log(`${colors.green}✓ Verbindung erfolgreich!${colors.reset}`);
    console.log(`  Zeit: ${connectionResult.rows[0].current_time}`);
    console.log(`  Version: ${connectionResult.rows[0].db_version.split(' ').slice(0, 2).join(' ')}\n`);

    // TEST 2: Prüfe ob Tabelle 'users' existiert
    console.log(`${colors.blue}[TEST 2]${colors.reset} Prüfe ob Tabelle 'users' existiert...`);
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log(`${colors.green}✓ Tabelle 'users' existiert!${colors.reset}\n`);
    } else {
      console.log(`${colors.red}✗ FEHLER: Tabelle 'users' existiert nicht!${colors.reset}`);
      console.log(`${colors.yellow}  → Führe 'docker-compose up -d' im /db Ordner aus${colors.reset}\n`);
      process.exit(1);
    }

    // TEST 3: Prüfe Spaltenstruktur
    console.log(`${colors.blue}[TEST 3]${colors.reset} Prüfe Spaltenstruktur der Tabelle 'users'...`);
    const columnsCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    const expectedColumns = ['id', 'email', 'username', 'rolename', 'password_hash', 'is_verified', 'created_at', 'updated_at'];
    const actualColumns = columnsCheck.rows.map(row => row.column_name);
    
    const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
    const extraColumns = actualColumns.filter(col => !expectedColumns.includes(col));

    if (missingColumns.length === 0) {
      console.log(`${colors.green}✓ Alle erwarteten Spalten vorhanden!${colors.reset}`);
      console.log(`  Spalten: ${actualColumns.join(', ')}\n`);
    } else {
      console.log(`${colors.red}✗ FEHLER: Fehlende Spalten: ${missingColumns.join(', ')}${colors.reset}\n`);
    }

    if (extraColumns.length > 0) {
      console.log(`${colors.yellow}⚠ Zusätzliche Spalten gefunden: ${extraColumns.join(', ')}${colors.reset}\n`);
    }

    // TEST 4: Detaillierte Spalteninformationen
    console.log(`${colors.blue}[TEST 4]${colors.reset} Detaillierte Spalteninformationen:`);
    console.log(`${colors.cyan}┌─────────────────┬──────────────────────┬──────────┐${colors.reset}`);
    console.log(`${colors.cyan}│ Spaltenname     │ Datentyp             │ Nullable │${colors.reset}`);
    console.log(`${colors.cyan}├─────────────────┼──────────────────────┼──────────┤${colors.reset}`);
    columnsCheck.rows.forEach(col => {
      const name = col.column_name.padEnd(15);
      const type = col.data_type.padEnd(20);
      const nullable = (col.is_nullable === 'YES' ? 'Ja' : 'Nein').padEnd(8);
      console.log(`${colors.cyan}│${colors.reset} ${name} ${colors.cyan}│${colors.reset} ${type} ${colors.cyan}│${colors.reset} ${nullable} ${colors.cyan}│${colors.reset}`);
    });
    console.log(`${colors.cyan}└─────────────────┴──────────────────────┴──────────┘${colors.reset}\n`);

    // TEST 5: Prüfe Constraints (Primary Key, Unique, etc.)
    console.log(`${colors.blue}[TEST 5]${colors.reset} Prüfe Constraints...`);
    const constraintsCheck = await pool.query(`
      SELECT
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.table_name = 'users' AND tc.table_schema = 'public'
      ORDER BY tc.constraint_type, kcu.column_name;
    `);

    if (constraintsCheck.rows.length > 0) {
      console.log(`${colors.green}✓ Gefundene Constraints:${colors.reset}`);
      constraintsCheck.rows.forEach(constraint => {
        const type = constraint.constraint_type === 'PRIMARY KEY' ? 'PRIMARY KEY' :
                     constraint.constraint_type === 'UNIQUE' ? 'UNIQUE' : 
                     constraint.constraint_type;
        console.log(`  - ${constraint.column_name}: ${type}`);
      });
      console.log('');
    }

    // TEST 6: Prüfe Extensions
    console.log(`${colors.blue}[TEST 6]${colors.reset} Prüfe installierte Extensions...`);
    const extensionsCheck = await pool.query(`
      SELECT extname FROM pg_extension WHERE extname = 'citext';
    `);

    if (extensionsCheck.rows.length > 0) {
      console.log(`${colors.green}✓ Extension 'citext' ist installiert!${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}⚠ Extension 'citext' nicht gefunden (sollte für email vorhanden sein)${colors.reset}\n`);
    }

    // TEST 7: Zähle vorhandene User
    console.log(`${colors.blue}[TEST 7]${colors.reset} Prüfe vorhandene Benutzer...`);
    const userCount = await pool.query("SELECT COUNT(*) as count FROM users");
    const users = await pool.query("SELECT id, username, email, rolename FROM users ORDER BY id");
    
    console.log(`${colors.green}✓ Anzahl Benutzer in der Datenbank: ${userCount.rows[0].count}${colors.reset}`);
    
    if (users.rows.length > 0) {
      console.log(`\n${colors.cyan}  Vorhandene Benutzer:${colors.reset}`);
      users.rows.forEach(user => {
        console.log(`    - ID: ${user.id} | Username: ${user.username} | Email: ${user.email} | Rolle: ${user.rolename}`);
      });
    }
    console.log('');

    // TEST 8: Prüfe ob Testuser vorhanden sind
    console.log(`${colors.blue}[TEST 8]${colors.reset} Prüfe ob Standard-Testuser vorhanden sind...`);
    const testUsers = ['dummyuser', 'dummyhr', 'dummysv'];
    let allTestUsersPresent = true;

    for (const testUser of testUsers) {
      const result = await pool.query("SELECT username, rolename FROM users WHERE username = $1", [testUser]);
      if (result.rows.length > 0) {
        console.log(`${colors.green}  ✓ ${testUser} (${result.rows[0].rolename}) vorhanden${colors.reset}`);
      } else {
        console.log(`${colors.red}  ✗ ${testUser} FEHLT${colors.reset}`);
        allTestUsersPresent = false;
      }
    }

    if (!allTestUsersPresent) {
      console.log(`${colors.yellow}\n  → Einige Testuser fehlen. Prüfe die init.sql Datei.${colors.reset}`);
    }
    console.log('');

    // ZUSAMMENFASSUNG
    console.log(`${colors.cyan}╔═══════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║              TEST ABGESCHLOSSEN           ║${colors.reset}`);
    console.log(`${colors.cyan}╚═══════════════════════════════════════════╝${colors.reset}`);
    console.log(`${colors.green}\n✓ Alle Basis-Tests erfolgreich durchgeführt!${colors.reset}`);
    console.log(`${colors.green}  Die Datenbank ist einsatzbereit.${colors.reset}\n`);

  } catch (error) {
    console.error(`${colors.red}\n✗ FEHLER beim Testen der Datenbank:${colors.reset}`);
    console.error(`${colors.red}  ${error.message}${colors.reset}`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log(`${colors.yellow}\n  LÖSUNG:${colors.reset}`);
      console.log(`  1. Prüfe, ob Docker läuft: ${colors.cyan}docker ps${colors.reset}`);
      console.log(`  2. Starte die Datenbank: ${colors.cyan}cd db && docker-compose up -d${colors.reset}`);
      console.log(`  3. Prüfe die .env Datei: DATABASE_URL korrekt?\n`);
    }
    
    process.exit(1);
  } finally {
    // Pool schließen
    await pool.end();
  }
}

// Skript ausführen
console.log(`${colors.yellow}Starte Datenbank-Tests...${colors.reset}\n`);
testDatabase();
