import { Router } from "express";
import { escalasController } from "../controllers/escalasController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const escalas = await escalasController.listar();
        res.json(escalas);
    } catch (error) {
        console.error("Erro ao listar escalas:", error);
        res.status(500).json({ error: "Erro ao listar escalas" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const escala = await escalasController.obter(id);
        if (!escala) {
            return res.status(404).json({ error: "Escala não encontrada" });
        }
        res.json(escala);
    } catch (error) {
        console.error("Erro ao obter escala:", error);
        res.status(500).json({ error: "Erro ao obter escala" });
    }
});

router.post("/", authenticate, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const escalaData = req.body;
        const id = await escalasController.criar(escalaData, userId);
        res.status(201).json({ id });
    } catch (error) {
        console.error("Erro ao criar escala:", error);
        res.status(500).json({ error: "Erro ao criar escala" });
    }
});

router.put("/:id", authenticate, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const escalaData = req.body;
        await escalasController.atualizar(id, escalaData);
        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao atualizar escala:", error);
        res.status(500).json({ error: "Erro ao atualizar escala" });
    }
});

router.delete("/:id", authenticate, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await escalasController.deletar(id);
        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao deletar escala:", error);
        res.status(500).json({ error: "Erro ao deletar escala" });
    }
});

export default router;