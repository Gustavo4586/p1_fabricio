import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();


import  {syncDatabase}  from './config/dbInit.js';


import { swaggerUi, swaggerDocs } from './config/swagger.js';


import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import noteRoutes from './routes/noteRoutes.js';


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


syncDatabase().then(() => {
  console.log('Bancos de dados inicializados com sucesso');
}).catch(err => {
  console.error('Erro ao inicializar bancos de dados:', err);
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.get('/', (req, res) => {
  res.json({ message: 'API de Gestão de Cursos e Anotações funcionando!' });
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notes', noteRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

export default app;
