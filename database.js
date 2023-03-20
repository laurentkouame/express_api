import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const creds = {
  user: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  host: process.env.DATABASE_URL,
  password: process.env.DATABASE_PWD,
  ssl: process.env.SSL ?? false,
};

export const pool = new pg.Pool(creds);
