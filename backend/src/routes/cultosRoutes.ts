import { Router } from "express";
import {
  criarCulto,
  listarCultos,
  obterCulto,
  atualizarCulto,
  deletarCulto,
} from "../controllers/cultosController";
import {
  adicionarCriancaAoCulto,
  removerCriancaDoCulto,
  listarCriancasDoCulto,
  marcarCheckout,
} from "../controllers/presencaController";
import { authenticate } from "../middleware/auth";
import { requireAdmin } from "../middleware/authorize";

const router = Router();

router.post("/", authenticate, requireAdmin, criarCulto);
router.get("/", listarCultos);
router.get("/:id", obterCulto);
router.put("/:id", authenticate, requireAdmin, atualizarCulto);
router.delete("/:id", authenticate, requireAdmin, deletarCulto);

// Rotas de presença
router.post(
  "/:id/criancas",
  authenticate,
  requireAdmin,
  adicionarCriancaAoCulto,
);
router.delete(
  "/:cultoId/criancas/:criancaId",
  authenticate,
  requireAdmin,
  removerCriancaDoCulto,
);
router.get("/:id/criancas", listarCriancasDoCulto);
router.patch(
  "/:cultoId/criancas/:criancaId/checkout",
  authenticate,
  requireAdmin,
  marcarCheckout,
);

export default router;
