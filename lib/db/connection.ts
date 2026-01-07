import { Pool } from 'pg';

// Database connection pool
let pool: Pool | null = null;

/**
 * Initialize the database connection pool
 */
export function initDatabase() {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
  });

  return pool;
}

/**
 * Get the database connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDatabase() first.');
  }
  return pool;
}

/**
 * Execute a query and return the result
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const db = getPool();
  const result = await db.query(text, params);
  return result.rows;
}

/**
 * Execute a query and return a single row
 */
export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] || null;
}

/**
 * Close the database connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

