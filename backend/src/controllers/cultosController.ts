import { Request, Response } from 'express';
import { dbAll, dbGet, dbRun } from '../database/db';
import { Culto } from '../types';

export const criarCulto = async (req: Request, res: Response) => {
    try {
        const { nome, periodo, data, userId } = req.body;

        if (!nome || !periodo || !data) {
            return res
                .status(400)
                .json({ error: 'Nome, período e data são obrigatórios' });
        }

        const result = await dbRun(
            'INSERT INTO cultos (nome, periodo, data, "userId") VALUES ($1, $2, $3, $4) RETURNING id',
            [nome, periodo, data, userId || null]
        );

        const culto = await dbGet<Culto>('SELECT * FROM cultos WHERE id = $1', [
            result.lastID,
        ]);
        res.status(201).json(culto);
    } catch (error) {
        console.error('Erro ao criar culto:', error);
        res.status(500).json({ error: 'Erro ao criar culto' });
    }
};

export const listarCultos = async (req: Request, res: Response) => {
    try {
        const cultos = await dbAll<Culto>(
            'SELECT * FROM cultos ORDER BY data DESC, nome'
        );
        res.json(cultos);
    } catch (error) {
        console.error('Erro ao listar cultos:', error);
        res.status(500).json({ error: 'Erro ao listar cultos' });
    }
};

export const obterCulto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const culto = await dbGet<Culto>('SELECT * FROM cultos WHERE id = $1', [
            id,
        ]);

        if (!culto) {
            return res.status(404).json({ error: 'Culto não encontrado' });
        }

        res.json(culto);
    } catch (error) {
        console.error('Erro ao obter culto:', error);
        res.status(500).json({ error: 'Erro ao obter culto' });
    }
};

export const atualizarCulto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, periodo, data, userId } = req.body;

        if (!nome || !periodo || !data) {
            return res
                .status(400)
                .json({ error: 'Nome, período e data são obrigatórios' });
        }

        await dbRun(
            'UPDATE cultos SET nome = $1, periodo = $2, data = $3, "userId" = $4, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $5',
            [nome, periodo, data, userId || null, id]
        );

        const culto = await dbGet<Culto>('SELECT * FROM cultos WHERE id = $1', [
            id,
        ]);
        res.json(culto);
    } catch (error) {
        console.error('Erro ao atualizar culto:', error);
        res.status(500).json({ error: 'Erro ao atualizar culto' });
    }
};

export const deletarCulto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await dbRun('DELETE FROM cultos WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar culto:', error);
        res.status(500).json({ error: 'Erro ao deletar culto' });
    }
};
