import { Request, Response } from 'express';
import { dbAll, dbGet, dbRun } from '../database/db';
import { Crianca } from '../types';

export const adicionarCriancaAoCulto = async (req: Request, res: Response) => {
    try {
        const { cultoId, criancaId } = req.body;

        if (!cultoId || !criancaId) {
            return res
                .status(400)
                .json({ error: 'cultoId e criancaId são obrigatórios' });
        }

        const culto = await dbGet('SELECT * FROM cultos WHERE id = $1', [
            cultoId,
        ]);
        if (!culto) {
            return res.status(404).json({ error: 'Culto não encontrado' });
        }

        const crianca = await dbGet('SELECT * FROM criancas WHERE id = $1', [
            criancaId,
        ]);
        if (!crianca) {
            return res.status(404).json({ error: 'Criança não encontrada' });
        }

        const presencaExistente = await dbGet(
            'SELECT * FROM presenca WHERE "cultoId" = $1 AND "criancaId" = $2',
            [cultoId, criancaId]
        );

        if (presencaExistente) {
            return res
                .status(400)
                .json({ error: 'Criança já está registrada neste culto' });
        }

        const result = await dbRun(
            'INSERT INTO presenca ("cultoId", "criancaId") VALUES ($1, $2) RETURNING id',
            [cultoId, criancaId]
        );

        const presenca = await dbGet('SELECT * FROM presenca WHERE id = $1', [
            result.lastID,
        ]);
        res.status(201).json(presenca);
    } catch (error) {
        console.error('Erro ao adicionar criança ao culto:', error);
        res.status(500).json({ error: 'Erro ao adicionar criança ao culto' });
    }
};

export const removerCriancaDoCulto = async (req: Request, res: Response) => {
    try {
        const { cultoId, criancaId } = req.params;

        await dbRun(
            'DELETE FROM presenca WHERE "cultoId" = $1 AND "criancaId" = $2',
            [cultoId, criancaId]
        );

        res.status(204).send();
    } catch (error) {
        console.error('Erro ao remover criança do culto:', error);
        res.status(500).json({ error: 'Erro ao remover criança do culto' });
    }
};

export const listarCriancasDoCulto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const criancas = await dbAll<Crianca & { presencaData: string }>(
            `SELECT c.*, p."createdAt" as "presencaData"
             FROM criancas c
             INNER JOIN presenca p ON c.id = p."criancaId"
             WHERE p."cultoId" = $1
             ORDER BY c.nome`,
            [id]
        );

        res.json(criancas);
    } catch (error) {
        console.error('Erro ao listar crianças do culto:', error);
        res.status(500).json({ error: 'Erro ao listar crianças do culto' });
    }
};
