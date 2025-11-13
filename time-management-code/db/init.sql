-- Erweiterungen aktivieren
CREATE EXTENSION IF NOT EXISTS citext;

-- Tabelle erstellen
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email CITEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO users (email, username, password_hash, is_verified)
VALUES ('dummy@example.com', 'dummyuser', '$argon2id$v=19$m=65536,t=3,p=4$4VsFnpyCJAWtYoph8KGdbA$0Txy7Aos46NnXRR0CFqW+xdzN0bPZEs4bUerVXZTHnQ', TRUE);