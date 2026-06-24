import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import controller from '../controllers/PedidoController';

const router = Router();

// Configuração do multer com fallback para public/uploads se FILES_PATH não estiver no .env
const defaultUploadFolder = path.resolve(__dirname, '../../../../../public/uploads');
const uploadFolder = process.env.FILES_PATH ? path.resolve(process.env.FILES_PATH) : defaultUploadFolder;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

router.get('/pedidos', controller.listAll);
router.post('/pedidos', controller.create);
router.delete('/pedidos/:id', controller.delete);
router.get('/pedidos/export', controller.exportCsv);
router.get('/analise', controller.getAnalise);

// Endpoint de upload utilizando multipart/form-data
router.post('/pedidos/upload', multer({ storage }).any(), controller.uploadFile);

export default router;
