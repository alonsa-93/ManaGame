import { Pool } from "pg";

let pool: Pool | null | undefined;

/**
 * Returns a pg Pool when DATABASE_URL is configured, otherwise null.
 * The store layer (lib/store) falls back to an in-process store when this
 * is null, so the app runs end-to-end without any database connected —
 * see lib/store/index.ts for the switch and README for the upgrade path.
 */
export function getPool(): Pool | null {
  if (pool !== undefined) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    pool = null;
    return pool;
  }
  pool = new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=disable") ? undefined : { rejectUnauthorized: false },
    max: 3,
  });
  return pool;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
