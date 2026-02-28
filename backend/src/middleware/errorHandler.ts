import { Request, Response, NextFunction } from 'express';

/**
 * Custom Error Class
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handler Middleware
 */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', err);
  
  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }
  
  // Handle YouTube API errors
  if (err.message.includes('quota')) {
    return res.status(429).json({
      success: false,
      error: {
        message: 'YouTube API quota exceeded. Please try again later.',
        code: 'QUOTA_EXCEEDED',
      },
    });
  }
  
  // Handle generic errors
  return res.status(500).json({
    success: false,
    error: {
      message: 'An unexpected error occurred. Please try again.',
      code: 'INTERNAL_ERROR',
    },
  });
}

/**
 * 404 Not Found Handler
 */
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
    },
  });
}
