import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/config';
import playlistRoutes from './routes/playlistRoutes';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

/**
 * Express Application Setup
 */
export function createApp(): Application {
  const app = express();
  
  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(
    cors({
      origin: config.cors.origins,
      credentials: config.cors.credentials,
    })
  );
  
  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Logging middleware (only in development)
  if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
  }
  
  // Rate limiting
  app.use('/api/', rateLimiter);
  
  // Routes
  app.use('/api', playlistRoutes);
  
  // 404 handler
  app.use(notFoundHandler);
  
  // Global error handler (must be last)
  app.use(errorHandler);
  
  return app;
}
