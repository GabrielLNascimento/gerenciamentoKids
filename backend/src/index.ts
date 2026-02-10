import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import criancasRoutes from './routes/criancasRoutes';
import cultosRoutes from './routes/cultosRoutes';
import estatisticasRoutes from './routes/estatisticasRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/criancas', criancasRoutes);
app.use('/api/cultos', cultosRoutes);
app.use('/api/estatisticas', estatisticasRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API funcionando' });
});

// Em produção: servir frontend buildado (SPA) — só se a pasta public existir
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
    app.get('*', (req, res) => {
        res.sendFile(path.join(publicDir, 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
