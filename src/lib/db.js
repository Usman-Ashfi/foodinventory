import { Pool } from 'pg'

const globalForPool = globalThis

export const pool =
  globalForPool.__dbPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPool.__dbPool = pool
}

export default pool
