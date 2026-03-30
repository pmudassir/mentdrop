import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

export type Database = ReturnType<typeof drizzle<typeof schema>>

let _db: Database | undefined

function getDb(): Database {
  if (!_db) {
    const url = process.env.DATABASE_URL!
    const sql = neon(url)
    _db = drizzle(sql, { schema })
  }
  return _db
}

// Lazy proxy — only calls neon() on first use (not at module-eval time)
export const db = new Proxy({} as Database, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(_target, prop) { return (getDb() as any)[prop] },
})
