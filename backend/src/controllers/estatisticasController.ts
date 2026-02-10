import { Request, Response } from 'express';
import { dbGet, dbAll } from '../database/db';
import { Estatisticas } from '../types';

export const obterEstatisticas = async (req: Request, res: Response) => {
    try {
        // Total de crianças
        const totalCriancasResult = await dbGet(
            'SELECT COUNT(*) as total FROM criancas'
        );
        const totalCriancas = (totalCriancasResult as any)?.total || 0;

        // Total de cultos
        const totalCultosResult = await dbGet(
            'SELECT COUNT(*) as total FROM cultos'
        );
        const totalCultos = (totalCultosResult as any)?.total || 0;

        // Frequência média (total de presenças / total de cultos)
        const totalPresencasResult = await dbGet(
            'SELECT COUNT(*) as total FROM presenca'
        );
        const totalPresencas = (totalPresencasResult as any)?.total || 0;
        const frequenciaMedia =
            totalCultos > 0
                ? (totalPresencas / totalCultos).toFixed(2)
                : '0.00';

        const estatisticas: Estatisticas = {
            totalCriancas: Number(totalCriancas),
            totalCultos: Number(totalCultos),
            frequenciaMedia: Number(frequenciaMedia),
        };

        res.json(estatisticas);
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
};
