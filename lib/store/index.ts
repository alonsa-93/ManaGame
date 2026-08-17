import { hasDatabase } from "@/lib/db/client";
import { memoryStore } from "@/lib/store/memory";
import { PgStore } from "@/lib/store/pg";
import type { Store } from "@/lib/store/types";

let pgStore: PgStore | null = null;

/**
 * Storage seam: Postgres when DATABASE_URL is set, an in-process store
 * otherwise. Every call site goes through this — nothing above the store
 * layer knows or cares which backend is active. See README "Connecting a
 * database" for the one-step upgrade.
 */
export function getStore(): Store {
  if (hasDatabase()) {
    if (!pgStore) pgStore = new PgStore();
    return pgStore;
  }
  return memoryStore;
}

export { hasDatabase };
