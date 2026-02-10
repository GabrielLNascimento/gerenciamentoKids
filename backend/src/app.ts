import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { ensureInit } from './database/db';
import criancasRoutes from './routes/criancasRoutes';
import cultosRoutes from './routes/cultosRoutes';
import estatisticasRoutes from './routes/estatisticasRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Middleware: garante que o banco está inicializado antes de qualquer rota
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
    try {
        await ensureInit();
        next();
    } catch (err) {
        next(err);
    }
});

// Rotas da API
app.use('/api/criancas', criancasRoutes);
app.use('/api/cultos', cultosRoutes);
app.use('/api/estatisticas', estatisticasRoutes);

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'API funcionando' });
});

// Em produção local: servir frontend buildado (SPA)
// No Vercel, os arquivos estáticos são servidos separadamente
if (!process.env.VERCEL) {
    const publicDir = path.join(__dirname, '../public');
    if (fs.existsSync(publicDir)) {
        app.use(express.static(publicDir));
        app.get('*', (_req, res) => {
            res.sendFile(path.join(publicDir, 'index.html'));
        });
    }
}

export default app;
