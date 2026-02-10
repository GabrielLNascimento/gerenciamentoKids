import { Request, Response } from 'express';
import { dbAll, dbGet, dbRun } from '../database/db';
import { Crianca } from '../types';

export const criarCrianca = async (req: Request, res: Response) => {
    try {
        const { nome, idade, responsavel, telefone } = req.body;

        if (!nome || !idade || !responsavel || !telefone) {
            return res
                .status(400)
                .json({ error: 'Todos os campos são obrigatórios' });
        }

        const result = await dbRun(
            'INSERT INTO criancas (nome, idade, responsavel, telefone) VALUES ($1, $2, $3, $4) RETURNING id',
            [nome, idade, responsavel, telefone]
        );

        const crianca = await dbGet<Crianca>(
            'SELECT * FROM criancas WHERE id = $1',
            [result.lastID]
        );
        res.status(201).json(crianca);
    } catch (error) {
        console.error('Erro ao criar criança:', error);
        res.status(500).json({ error: 'Erro ao criar criança' });
    }
};

export const listarCriancas = async (req: Request, res: Response) => {
    try {
        const criancas = await dbAll<Crianca>(
            'SELECT * FROM criancas ORDER BY nome'
        );
        res.json(criancas);
    } catch (error) {
        console.error('Erro ao listar crianças:', error);
        res.status(500).json({ error: 'Erro ao listar crianças' });
    }
};

export const buscarCriancasPorNome = async (req: Request, res: Response) => {
    try {
        const { nome } = req.query;
        if (!nome || typeof nome !== 'string') {
            return res
                .status(400)
                .json({ error: 'Parâmetro nome é obrigatório' });
        }

        const criancas = await dbAll<Crianca>(
            'SELECT * FROM criancas WHERE nome ILIKE $1 ORDER BY nome',
            [`%${nome}%`]
        );
        res.json(criancas);
    } catch (error) {
        console.error('Erro ao buscar crianças:', error);
        res.status(500).json({ error: 'Erro ao buscar crianças' });
    }
};

export const obterCrianca = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const crianca = await dbGet<Crianca>(
            'SELECT * FROM criancas WHERE id = $1',
            [id]
        );

        if (!crianca) {
            return res.status(404).json({ error: 'Criança não encontrada' });
        }

        res.json(crianca);
    } catch (error) {
        console.error('Erro ao obter criança:', error);
        res.status(500).json({ error: 'Erro ao obter criança' });
    }
};

export const atualizarCrianca = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, idade, responsavel, telefone } = req.body;

        if (!nome || !idade || !responsavel || !telefone) {
            return res
                .status(400)
                .json({ error: 'Todos os campos são obrigatórios' });
        }

        await dbRun(
            'UPDATE criancas SET nome = $1, idade = $2, responsavel = $3, telefone = $4, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $5',
            [nome, idade, responsavel, telefone, id]
        );

        const crianca = await dbGet<Crianca>(
            'SELECT * FROM criancas WHERE id = $1',
            [id]
        );
        res.json(crianca);
    } catch (error) {
        console.error('Erro ao atualizar criança:', error);
        res.status(500).json({ error: 'Erro ao atualizar criança' });
    }
};

export const deletarCrianca = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await dbRun('DELETE FROM criancas WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar criança:', error);
        res.status(500).json({ error: 'Erro ao deletar criança' });
    }
};
