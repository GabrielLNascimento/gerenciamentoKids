import request from "supertest";
import express from "express";
import cultosRoutes from "../routes/cultosRoutes";
import { dbRun, dbAll, ensureInit, close } from "../database/db";

const app = express();
app.use(express.json());
app.use("/api/cultos", cultosRoutes);

describe("API de Cultos", () => {
    beforeAll(async () => {
        await ensureInit();
    });

    afterAll(async () => {
        await close();
    });

    beforeEach(async () => {
        await dbRun("DELETE FROM presenca");
        await dbRun("DELETE FROM cultos");
    });

    test("POST /api/cultos - Criar culto", async () => {
        const novoCulto = {
            nome: "Culto Dominical",
            periodo: "Manhã",
            data: "2024-01-15",
            userId: "user123",
        };

        const response = await request(app)
            .post("/api/cultos")
            .send(novoCulto)
            .expect(201);

        expect(response.body).toHaveProperty("id");
        expect(response.body.nome).toBe(novoCulto.nome);
        expect(response.body.periodo).toBe(novoCulto.periodo);
    });

    test("GET /api/cultos - Listar cultos", async () => {
        await dbRun(
            "INSERT INTO cultos (nome, periodo, data) VALUES ($1, $2, $3) RETURNING id",
            ["Culto 1", "Manhã", "2024-01-15"],
        );
        await dbRun(
            "INSERT INTO cultos (nome, periodo, data) VALUES ($1, $2, $3) RETURNING id",
            ["Culto 2", "Tarde", "2024-01-16"],
        );

        const response = await request(app).get("/api/cultos").expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
    });

    test("PUT /api/cultos/:id - Atualizar culto", async () => {
        const result = await dbRun(
            "INSERT INTO cultos (nome, periodo, data) VALUES ($1, $2, $3) RETURNING id",
            ["Culto 1", "Manhã", "2024-01-15"],
        );

        const response = await request(app)
            .put(`/api/cultos/${result.lastID}`)
            .send({
                nome: "Culto Atualizado",
                periodo: "Tarde",
                data: "2024-01-16",
            })
            .expect(200);

        expect(response.body.nome).toBe("Culto Atualizado");
        expect(response.body.periodo).toBe("Tarde");
    });

    test("DELETE /api/cultos/:id - Deletar culto", async () => {
        const result = await dbRun(
            "INSERT INTO cultos (nome, periodo, data) VALUES ($1, $2, $3) RETURNING id",
            ["Culto 1", "Manhã", "2024-01-15"],
        );

        await request(app).delete(`/api/cultos/${result.lastID}`).expect(204);

        const cultos = await dbAll("SELECT * FROM cultos WHERE id = $1", [
            result.lastID,
        ]);
        expect(cultos.length).toBe(0);
    });
});
