import { Router } from 'express';
import { obterRelatorio } from '../controllers/relatorioController';

const router = Router();

router.get('/', obterRelatorio);

export default router;
