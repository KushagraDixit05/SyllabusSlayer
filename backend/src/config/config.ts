import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Application Configuration
 * Centralized configuration management with validation
 */

const requiredEnvVars = ['YOUTUBE_API_KEY'] as const;

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // YouTube API Configuration
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY!,
    baseUrl: 'https://www.googleapis.com/youtube/v3',
    maxResults: 50, // YouTube API limit per request
    quotaLimit: 10000, // Daily quota limit
  },
  
  // CORS Configuration
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  
  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
} as const;

export default config;
