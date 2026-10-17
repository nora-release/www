import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";

const pools = new Map<string, Pool>();

export function getDatabasePool(connectionString: string): Pool {
  const existing = pools.get(connectionString);

  if (existing) {
    return existing;
  }

  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 10_000,
  });

  if (process.env.VERCEL) {
    attachDatabasePool(pool);
  }

  pools.set(connectionString, pool);

  return pool;
}
