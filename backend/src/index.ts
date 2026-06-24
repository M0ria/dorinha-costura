import 'reflect-metadata';
import dotenv from 'dotenv';

// Carrega variáveis de ambiente: backend/.env tem prioridade, root .env como fallback
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });   // backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // root .env (fallback)

// Inicia o servidor Express
import './server';
