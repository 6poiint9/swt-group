import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

DATABASE_URL="postgres://user:pass@localhost:5432/secureauth"
PORT=3000

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
