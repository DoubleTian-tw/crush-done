import express from 'express';
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import dotenv from 'dotenv';
import globalErrorHandler from './middleware/globalErrorHandler.js';
import createAppError from './utils/appError.js';
import swaggerUi from 'swagger-ui-express';
import openapiSpecification from './config/swagger.js';
import cors from 'cors';
dotenv.config();
const app = express();
const corsOption = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}

app.use(express.json());
app.use(cors(corsOption));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/todo', todoRoutes);

app.all('/*splat', (req, res, next) => {
    const err = createAppError(`找不到路徑：${req.originalUrl}`, 404);
    next(err);
});

app.use(globalErrorHandler);

try {
    const res = await db.query('SELECT NOW()');
    console.log(`[測試連線] 時間為：`, res.rows[0].now)
} catch (error) {
    console.log(error)
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})