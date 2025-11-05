/* ========= LOGIN-INIT.SQL ========= */
/* Erstellt nur die minimal nötigen Tabellen für den Login-Prozess. */


/* ========= SCHRITT 0: ALLES AUFRÄUMEN (für Wiederholbarkeit) ========= */
-- Löscht die Tabelle und den Typ, falls sie schon existieren.
DROP TABLE IF EXISTS Users;
DROP TYPE IF EXISTS user_role;


/* ========= SCHRITT 1: Eigener Datentyp (ENUM) für die Rollen ========= */
-- Wird vom Backend nach dem Login benötigt, um HR/Supervisor/Employee zu unterscheiden.
CREATE TYPE user_role AS ENUM (
    'Employee',
    'Supervisor',
    'HR'
);


/* ========= SCHRITT 2: Die USERS Tabelle erstellen ========= */
-- Speichert Login-Daten (Username, Hash) und die zugewiesene Rolle.
CREATE TABLE Users (
    userID        SERIAL PRIMARY KEY, -- Eindeutige ID, zählt automatisch hoch
    username      VARCHAR(50) NOT NULL UNIQUE, -- Login-Name, muss einzigartig sein
    passwordHash  VARCHAR(255) NOT NULL, -- NUR das gehashte Passwort!
    role          user_role NOT NULL DEFAULT 'Employee', -- Standard-Rolle ist Employee
    
    -- Verknüpft einen Mitarbeiter mit seinem Vorgesetzten (kann später genutzt werden)
    supervisorID  INTEGER REFERENCES Users(userID) 
);


/* ========= SCHRITT 3: Test-User einfügen ========= */
-- HINWEIS: Dies sind nur Beispiel-Hashes. Das Backend muss echte Hashes generieren.

-- 1. Erstelle einen Supervisor (hat keinen eigenen Supervisor, daher NULL)
INSERT INTO Users (username, passwordHash, role, supervisorID) 
VALUES 
('m.sonntag', 'hash_fuer_supervisor_abc123', 'Supervisor', NULL);

-- 2. Erstelle einen Employee (sein Vorgesetzter ist User mit ID 1)
INSERT INTO Users (username, passwordHash, role, supervisorID) 
VALUES 
('b.poth', 'hash_fuer_employee_xyz789', 'Employee', 1);

-- 3. Erstelle einen HR-Mitarbeiter (hat auch keinen Supervisor in diesem Bsp.)
INSERT INTO Users (username, passwordHash, role, supervisorID) 
VALUES 
('h.meier', 'hash_fuer_hr_qwert456', 'HR', NULL);