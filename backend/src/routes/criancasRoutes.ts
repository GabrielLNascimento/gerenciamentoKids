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
import { authenticate } from "../middleware/auth";
import { requireAdmin } from "../middleware/authorize";

const router = Router();

router.post("/", authenticate, requireAdmin, criarCrianca);
router.get("/buscar", buscarCriancasPorNome);
router.get("/", listarCriancas);
router.get("/:id", obterCrianca);
router.put("/:id", authenticate, requireAdmin, atualizarCrianca);
router.patch("/:id/relatorio", authenticate, requireAdmin, atualizarRelatorio);
router.delete("/:id", authenticate, requireAdmin, deletarCrianca);
router.get("/:id/frequencia", listarFrequenciaDaCrianca);

export default router;
