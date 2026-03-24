import { Request, Response } from "express";
import { dbAll } from "../database/db";

export const obterRelatorio = async (_req: Request, res: Response) => {
    try {
        const relatorio = await dbAll<{
            id: number;
            nome: string;
            periodo: string;
            data: string;
            bebes: number;
            medios1: number;
            medios2: number;
            grandes: number;
            total: number;
        }>(`
            SELECT
                cu.id,
                cu.nome,
                cu.periodo,
                cu.data,
                COUNT(CASE WHEN DATE_PART('year', AGE(CURRENT_DATE, c."dataNascimento"::date)) BETWEEN 1 AND 2 THEN 1 END)::int AS bebes,
                COUNT(CASE WHEN DATE_PART('year', AGE(CURRENT_DATE, c."dataNascimento"::date)) BETWEEN 3 AND 4 THEN 1 END)::int AS medios1,
                COUNT(CASE WHEN DATE_PART('year', AGE(CURRENT_DATE, c."dataNascimento"::date)) BETWEEN 5 AND 6 THEN 1 END)::int AS medios2,
                COUNT(CASE WHEN DATE_PART('year', AGE(CURRENT_DATE, c."dataNascimento"::date)) BETWEEN 7 AND 11 THEN 1 END)::int AS grandes,
                COUNT(c.id)::int AS total
            FROM cultos cu
            LEFT JOIN presenca p ON cu.id = p."cultoId"
            LEFT JOIN criancas c ON p."criancaId" = c.id
            GROUP BY cu.id, cu.nome, cu.periodo, cu.data
            ORDER BY cu.data DESC
        `);

        res.json(relatorio);
    } catch (error) {
        console.error("Erro ao obter relatório:", error);
        res.status(500).json({ error: "Erro ao obter relatório" });
    }
};
