import request from 'supertest';
import express from 'express';
import criancasRoutes from '../routes/criancasRoutes';
import { dbRun, dbAll, ensureInit } from '../database/db';

const app = express();
app.use(express.json());
app.use('/api/criancas', criancasRoutes);

describe('API de Crianças', () => {
    beforeAll(async () => {
        await ensureInit();
    });

    beforeEach(async () => {
        await dbRun('DELETE FROM presenca');
        await dbRun('DELETE FROM criancas');
    });

    test('POST /api/criancas - Criar criança', async () => {
        const novaCrianca = {
            nome: 'João Silva',
            idade: 8,
            responsavel: 'Maria Silva',
            telefone: '11999999999',
        };

        const response = await request(app)
            .post('/api/criancas')
            .send(novaCrianca)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.nome).toBe(novaCrianca.nome);
        expect(response.body.idade).toBe(novaCrianca.idade);
    });

    test('POST /api/criancas - Erro ao criar sem campos obrigatórios', async () => {
        const response = await request(app)
            .post('/api/criancas')
            .send({ nome: 'João' })
            .expect(400);

        expect(response.body).toHaveProperty('error');
    });

    test('GET /api/criancas - Listar crianças', async () => {
        await dbRun(
            'INSERT INTO criancas (nome, idade, responsavel, telefone) VALUES ($1, $2, $3, $4) RETURNING id',
            ['João', 8, 'Maria', '11999999999']
        );
        await dbRun(
            'INSERT INTO criancas (nome, idade, responsavel, telefone) VALUES ($1, $2, $3, $4) RETURNING id',
            ['Ana', 10, 'Pedro', '11888888888']
        );

        const response = await request(app).get('/api/criancas').expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
    });

    test('GET /api/criancas/buscar?nome=João - Buscar crianças por nome', async () => {
        await dbRun(
            'INSERT INTO criancas (nome, idade, responsavel, telefone) VALUES ($1, $2, $3, $4) RETURNING id',
            ['João Silva', 8, 'Maria', '11999999999']
        );
        await dbRun(
            'INSERT INTO criancas (nome, idade, responsavel, telefone) VALUES ($1, $2, $3, $4) RETURNING id',
            ['Ana', 10, 'Pedro', '11888888888']
        );

        const response = await request(app)
            .get('/api/criancas/buscar?nome=João')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nome).toContain('João');
    });

    test('PUT /api/criancas/:id - Atualizar criança', async () => {
        const result = await dbRun(
            'INSERT INTO criancas (nome, idade, responsavel, telefone) VALUES ($1, $2, $3, $4) RETURNING id',
            ['João', 8, 'Maria', '11999999999']
        );

        const response = await request(app)
            .put(`/api/criancas/${result.lastID}`)
            .send({
                nome: 'João Silva',
                idade: 9,
                responsavel: 'Maria Silva',
                telefone: '11999999999',
            })
            .expect(200);

        expect(response.body.nome).toBe('João Silva');
        expect(response.body.idade).toBe(9);
    });

    test('DELETE /api/criancas/:id - Deletar criança', async () => {
        const result = await dbRun(
            'INSERT INTO criancas (nome, idade, responsavel, telefone) VALUES ($1, $2, $3, $4) RETURNING id',
            ['João', 8, 'Maria', '11999999999']
        );

        await request(app).delete(`/api/criancas/${result.lastID}`).expect(204);

        const criancas = await dbAll('SELECT * FROM criancas WHERE id = $1', [
            result.lastID,
        ]);
        expect(criancas.length).toBe(0);
    });
});
