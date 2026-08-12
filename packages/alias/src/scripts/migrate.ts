import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getPool } from "../db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate(): Promise<void> {
  const pool = getPool();
  const sql = readFileSync(
    join(__dirname, "../../migrations/001_init.sql"),
    "utf-8"
  );
  await pool.query(sql);
  console.log("Migration 001_init.sql appliquée.");
  const sql2 = readFileSync(join(__dirname, "../../migrations/002_main_alias_active.sql"), "utf-8");
  await pool.query(sql2);
  console.log("Migration 002_main_alias_active.sql appliquée.");
  await pool.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});