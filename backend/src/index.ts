import { ensureInit } from './database/db';
import app from './app';

const PORT = process.env.PORT || 3001;

ensureInit()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao conectar ao banco (Neon/PostgreSQL):', err);
        process.exit(1);
    });
