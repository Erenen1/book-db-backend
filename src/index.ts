import express from 'express';
import dotenv from 'dotenv';
import { initializeDatabase, closeDatabaseConnection } from './config/initDatabase';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
import authRoutes from './routes/authRoutes';
import bookRoutes from './routes/bookRoutes';
import commentRoutes from './routes/commentRoutes';
import userRoutes from './routes/userRoutes';
import bookListRoutes from './routes/bookListRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Swagger UI setup
const swaggerFile = fs.readFileSync(path.resolve(__dirname, '../swagger.json'), 'utf8');
const swaggerSpec = JSON.parse(swaggerFile);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.get('/', (_req, res) => {
  res.json({ message: 'Kitap Veritabanı API - Aktif' });
});

// API sürümü ve öneki
const API_PREFIX = '/api';

// Import and use routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/books`, bookRoutes);
app.use(`${API_PREFIX}/comments`, commentRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/book-lists`, bookListRoutes);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ message: 'Sayfa bulunamadı' });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Bir hata oluştu'
  });
});

// Start server
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await closeDatabaseConnection();
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
};

// Initialize application
(async () => {
  try {
    await initializeDatabase();
    startServer();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
})(); 