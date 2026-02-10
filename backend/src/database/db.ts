import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.warn(
        'DATABASE_URL não definida. Configure a connection string do Neon no .env'
    );
}

const pool = new Pool({
    connectionString,
    ssl: connectionString?.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : undefined,
});

export async function initTables(): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS criancas (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                idade INTEGER NOT NULL,
                responsavel TEXT NOT NULL,
                telefone TEXT NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS cultos (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                periodo TEXT NOT NULL,
                data TEXT NOT NULL,
                "userId" TEXT,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await client.query(`
            CREATE TABLE IF NOT EXISTS presenca (
                id SERIAL PRIMARY KEY,
                "criancaId" INTEGER NOT NULL REFERENCES criancas(id) ON DELETE CASCADE,
                "cultoId" INTEGER NOT NULL REFERENCES cultos(id) ON DELETE CASCADE,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE("criancaId", "cultoId")
            )
        `);
        console.log('Tabelas PostgreSQL (Neon) verificadas/criadas.');
    } finally {
        client.release();
    }
}

// Inicializa as tabelas ao carregar o módulo (conexão assíncrona)
let initPromise: Promise<void> | null = null;
export function ensureInit(): Promise<void> {
    if (!initPromise) {
        initPromise = initTables();
    }
    return initPromise;
}

/** Retorna a primeira linha ou null (equivalente ao dbGet do SQLite). */
export async function dbGet<T = any>(
    sql: string,
    params?: any[]
): Promise<T | null> {
    const result = await pool.query(sql, params ?? []);
    return (result.rows[0] as T) ?? null;
}

/** Retorna todas as linhas (equivalente ao dbAll do SQLite). */
export async function dbAll<T = any>(
    sql: string,
    params?: any[]
): Promise<T[]> {
    const result = await pool.query(sql, params ?? []);
    return result.rows as T[];
}

/** Executa INSERT/UPDATE/DELETE. Para INSERT, use RETURNING id e lastID virá preenchido. */
export async function dbRun(
    sql: string,
    params?: any[]
): Promise<{ lastID: number; changes: number }> {
    const result = await pool.query(sql, params ?? []);
    const row = result.rows[0];
    const rawId = row?.id;
    const lastID = rawId !== undefined && rawId !== null ? Number(rawId) : 0;
    const changes = result.rowCount ?? 0;
    return { lastID, changes };
}

export async function close(): Promise<void> {
    await pool.end();
}

export { pool };
