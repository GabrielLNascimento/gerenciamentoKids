import request from 'supertest';
import express from 'express';
import estatisticasRoutes from '../routes/estatisticasRoutes';
import { dbRun, ensureInit } from '../database/db';

const app = express();
app.use(express.json());
app.use('/api/estatisticas', estatisticasRoutes);

describe('API de Estatísticas', () => {
    beforeAll(async () => {
        await ensureInit();
    });

    beforeEach(async () => {
        await dbRun('DELETE FROM presenca');
        await dbRun('DELETE FROM cultos');
        await dbRun('DELETE FROM criancas');
    });

    test('GET /api/estatisticas - Obter estatísticas', async () => {
        const crianca1 = await dbRun(
            'INSERT INTO criancas (nome, idade, responsavel, telefone) VALUES ($1, $2, $3, $4) RETURNING id',
            ['João', 8, 'Maria', '11999999999']
        );
        const crianca2 = await dbRun(
            'INSERT INTO criancas (nome, idade, responsavel, telefone) VALUES ($1, $2, $3, $4) RETURNING id',
            ['Ana', 10, 'Pedro', '11888888888']
        );

        const culto1 = await dbRun(
            'INSERT INTO cultos (nome, periodo, data) VALUES ($1, $2, $3) RETURNING id',
            ['Culto 1', 'Manhã', '2024-01-15']
        );
        const culto2 = await dbRun(
            'INSERT INTO cultos (nome, periodo, data) VALUES ($1, $2, $3) RETURNING id',
            ['Culto 2', 'Tarde', '2024-01-16']
        );

        await dbRun(
            'INSERT INTO presenca ("cultoId", "criancaId") VALUES ($1, $2) RETURNING id',
            [culto1.lastID, crianca1.lastID]
        );
        await dbRun(
            'INSERT INTO presenca ("cultoId", "criancaId") VALUES ($1, $2) RETURNING id',
            [culto1.lastID, crianca2.lastID]
        );
        await dbRun(
            'INSERT INTO presenca ("cultoId", "criancaId") VALUES ($1, $2) RETURNING id',
            [culto2.lastID, crianca1.lastID]
        );

        const response = await request(app)
            .get('/api/estatisticas')
            .expect(200);

        expect(response.body).toHaveProperty('totalCriancas');
        expect(response.body).toHaveProperty('totalCultos');
        expect(response.body).toHaveProperty('frequenciaMedia');
        expect(response.body.totalCriancas).toBe(2);
        expect(response.body.totalCultos).toBe(2);
        expect(response.body.frequenciaMedia).toBe(1.5);
    });
});
