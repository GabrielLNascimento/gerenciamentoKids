import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const dbPath =
    process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');

class Database {
    private db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados:', err);
            } else {
                console.log('Conectado ao banco de dados SQLite');
                this.initTables();
            }
        });
    }

    private initTables() {
        // Tabela de crianças
        this.db.run(`
      CREATE TABLE IF NOT EXISTS criancas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        idade INTEGER NOT NULL,
        responsavel TEXT NOT NULL,
        telefone TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Tabela de cultos
        this.db.run(`
      CREATE TABLE IF NOT EXISTS cultos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        periodo TEXT NOT NULL,
        data TEXT NOT NULL,
        userId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Tabela de presença (relação entre crianças e cultos)
        this.db.run(`
      CREATE TABLE IF NOT EXISTS presenca (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        criancaId INTEGER NOT NULL,
        cultoId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (criancaId) REFERENCES criancas(id) ON DELETE CASCADE,
        FOREIGN KEY (cultoId) REFERENCES cultos(id) ON DELETE CASCADE,
        UNIQUE(criancaId, cultoId)
      )
    `);
    }

    getDb(): sqlite3.Database {
        return this.db;
    }

    close() {
        return new Promise<void>((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

export const database = new Database();
export const db = database.getDb();

// Funções auxiliares promisificadas
export const dbGet = promisify(db.get.bind(db));
export const dbAll = promisify(db.all.bind(db));

// dbRun customizado para retornar lastID
export const dbRun = (
    sql: string,
    params?: any[]
): Promise<{ lastID: number; changes: number }> => {
    return new Promise((resolve, reject) => {
        db.run(sql, params || [], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
};
