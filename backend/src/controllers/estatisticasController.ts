import { Request, Response } from 'express';
import { dbGet, dbAll } from '../database/db';
import { Estatisticas } from '../types';

export const obterEstatisticas = async (req: Request, res: Response) => {
    try {
        const totalCriancasResult = await dbGet<{ total: string }>(
            'SELECT COUNT(*)::int as total FROM criancas'
        );
        const totalCriancas = Number(totalCriancasResult?.total ?? 0);

        const totalCultosResult = await dbGet<{ total: string }>(
            'SELECT COUNT(*)::int as total FROM cultos'
        );
        const totalCultos = Number(totalCultosResult?.total ?? 0);

        const totalPresencasResult = await dbGet<{ total: string }>(
            'SELECT COUNT(*)::int as total FROM presenca'
        );
        const totalPresencas = Number(totalPresencasResult?.total ?? 0);
        const frequenciaMedia =
            totalCultos > 0
                ? Number((totalPresencas / totalCultos).toFixed(2))
                : 0;

        const estatisticas: Estatisticas = {
            totalCriancas,
            totalCultos,
            frequenciaMedia,
        };

        res.json(estatisticas);
    } catch (error) {
        console.error('Erro ao obter estatísticas:', error);
        res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
};
