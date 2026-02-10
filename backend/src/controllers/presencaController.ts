import { Request, Response } from 'express';
import { dbAll, dbGet, dbRun } from '../database/db';

export const adicionarCriancaAoCulto = async (req: Request, res: Response) => {
    try {
        const { cultoId, criancaId } = req.body;

        if (!cultoId || !criancaId) {
            return res
                .status(400)
                .json({ error: 'cultoId e criancaId são obrigatórios' });
        }

        // Verificar se culto existe
        const culto = await dbGet('SELECT * FROM cultos WHERE id = ?', [
            cultoId,
        ]);
        if (!culto) {
            return res.status(404).json({ error: 'Culto não encontrado' });
        }

        // Verificar se criança existe
        const crianca = await dbGet('SELECT * FROM criancas WHERE id = ?', [
            criancaId,
        ]);
        if (!crianca) {
            return res.status(404).json({ error: 'Criança não encontrada' });
        }

        // Verificar se já existe
        const presencaExistente = await dbGet(
            'SELECT * FROM presenca WHERE cultoId = ? AND criancaId = ?',
            [cultoId, criancaId]
        );

        if (presencaExistente) {
            return res
                .status(400)
                .json({ error: 'Criança já está registrada neste culto' });
        }

        const result = await dbRun(
            'INSERT INTO presenca (cultoId, criancaId) VALUES (?, ?)',
            [cultoId, criancaId]
        );

        const presenca = await dbGet('SELECT * FROM presenca WHERE id = ?', [
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
            'DELETE FROM presenca WHERE cultoId = ? AND criancaId = ?',
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

        const criancas = await dbAll(
            `SELECT c.*, p.createdAt as presencaData 
       FROM criancas c 
       INNER JOIN presenca p ON c.id = p.criancaId 
       WHERE p.cultoId = ? 
       ORDER BY c.nome`,
            [id]
        );

        res.json(criancas);
    } catch (error) {
        console.error('Erro ao listar crianças do culto:', error);
        res.status(500).json({ error: 'Erro ao listar crianças do culto' });
    }
};
