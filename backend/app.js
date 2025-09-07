import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import todoRoutes from './routes/todoRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.use('/api/todos', todoRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

export { app };