import { Router } from 'express';
import { obterEstatisticas } from '../controllers/estatisticasController';

const router = Router();

router.get('/', obterEstatisticas);

export default router;
