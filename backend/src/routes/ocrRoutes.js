import express from 'express';
import multer from 'multer';
import { ocrController } from '../controllers/ocrController.js';

const router = express.Router();
const upload = multer();

router.post('/upload', upload.single('document'), ocrController);

export default router;
