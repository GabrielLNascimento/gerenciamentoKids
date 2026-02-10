import { Router } from 'express';
import {
    criarCrianca,
    listarCriancas,
    buscarCriancasPorNome,
    obterCrianca,
    atualizarCrianca,
    deletarCrianca,
} from '../controllers/criancasController';

const router = Router();

router.post('/', criarCrianca);
router.get('/', listarCriancas);
router.get('/buscar', buscarCriancasPorNome);
router.get('/:id', obterCrianca);
router.put('/:id', atualizarCrianca);
router.delete('/:id', deletarCrianca);

export default router;
