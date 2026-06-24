import { Router } from 'express';
import controller from '../controllers/PedidoController';

const router = Router();

router.get('/pedidos', controller.listAll);
router.post('/pedidos', controller.create);
router.delete('/pedidos/:id', controller.delete);
router.get('/analise', controller.getAnalise);

export default router;
