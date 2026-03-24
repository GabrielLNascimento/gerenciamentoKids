import { Router } from "express";
import {
    criarCrianca,
    listarCriancas,
    buscarCriancasPorNome,
    obterCrianca,
    atualizarCrianca,
    atualizarRelatorio,
    deletarCrianca,
} from "../controllers/criancasController";
import { listarFrequenciaDaCrianca } from "../controllers/presencaController";

const router = Router();

router.post("/", criarCrianca);
router.get("/buscar", buscarCriancasPorNome);
router.get("/", listarCriancas);
router.get("/:id", obterCrianca);
router.put("/:id", atualizarCrianca);
router.patch("/:id/relatorio", atualizarRelatorio);
router.delete("/:id", deletarCrianca);
router.get("/:id/frequencia", listarFrequenciaDaCrianca);

export default router;
