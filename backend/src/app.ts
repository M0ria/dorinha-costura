import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import pedidoRoutes from './presentation/routes/pedidoRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', pedidoRoutes);

export { app };
export default app;
