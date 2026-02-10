import { Router } from 'express';
import {
    criarCulto,
    listarCultos,
    obterCulto,
    atualizarCulto,
    deletarCulto,
} from '../controllers/cultosController';
import {
    adicionarCriancaAoCulto,
    removerCriancaDoCulto,
    listarCriancasDoCulto,
} from '../controllers/presencaController';

const router = Router();

router.post('/', criarCulto);
router.get('/', listarCultos);
router.get('/:id', obterCulto);
router.put('/:id', atualizarCulto);
router.delete('/:id', deletarCulto);

// Rotas de presença
router.post('/:id/criancas', adicionarCriancaAoCulto);
router.delete('/:cultoId/criancas/:criancaId', removerCriancaDoCulto);
router.get('/:id/criancas', listarCriancasDoCulto);

export default router;
