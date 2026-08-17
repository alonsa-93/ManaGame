import pg from "pg";
import fs from "node:fs";
import path from "node:path";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.log(
    "DATABASE_URL not set — skipping migration. The app runs on the in-process store until a database is connected (see README)."
  );
  process.exit(0);
}

const sql = fs.readFileSync(path.resolve("lib/db/schema.sql"), "utf8");
const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });

try {
  await pool.query(sql);
  console.log("✓ ManaGame schema applied.");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exit(1);
} finally {
  await pool.end();
}
