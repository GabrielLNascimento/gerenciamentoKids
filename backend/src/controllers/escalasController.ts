import { dbGet, dbAll, dbRun } from "../database/db";

export interface Escala {
    id?: number;
    sala: string;
    nome1: string;
    nome2: string | null;
    periodo: string;
    data: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export const escalasController = {
    async listar() {
        return dbAll<Escala>("SELECT * FROM escalas ORDER BY data DESC");
    },

    async obter(id: number) {
        return dbGet<Escala>("SELECT * FROM escalas WHERE id = $1", [id]);
    },

    async criar(escala: Omit<Escala, "id">, userId?: string) {
        const result = await dbRun(
            "INSERT INTO escalas (sala, nome1, nome2, periodo, data, \"userId\") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            [escala.sala, escala.nome1, escala.nome2 || null, escala.periodo, escala.data, userId]
        );
        return result.lastID;
    },

    async atualizar(id: number, escala: Partial<Escala>) {
        const campos: string[] = [];
        const valores: any[] = [];
        let idx = 1;

        if (escala.sala !== undefined) {
            campos.push(`sala = $${idx++}`);
            valores.push(escala.sala);
        }
        if (escala.nome1 !== undefined) {
            campos.push(`nome1 = $${idx++}`);
            valores.push(escala.nome1);
        }
        if (escala.nome2 !== undefined) {
            campos.push(`nome2 = $${idx++}`);
            valores.push(escala.nome2);
        }
        if (escala.periodo !== undefined) {
            campos.push(`periodo = $${idx++}`);
            valores.push(escala.periodo);
        }
        if (escala.data !== undefined) {
            campos.push(`data = $${idx++}`);
            valores.push(escala.data);
        }

        if (campos.length > 0) {
            campos.push(`"updatedAt" = CURRENT_TIMESTAMP`);
            valores.push(id);
            await dbRun(
                `UPDATE escalas SET ${campos.join(", ")} WHERE id = $${idx}`,
                valores
            );
        }
    },

    async deletar(id: number) {
        return dbRun("DELETE FROM escalas WHERE id = $1", [id]);
    },
};