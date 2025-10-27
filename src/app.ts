import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { corsMiddleware } from './middleware/cors';
import routes from './routes';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Health check endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'WAR Backend API - Express.js',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', routes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    path: req.path
  });
});

// Error Handler (must be last)
app.use(errorHandler);

export default app;
