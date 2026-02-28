import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { youtubeService } from '../services/youtubeService';
import { extractPlaylistId, isValidPlaylistId } from '../utils/urlParser';
import { AppError } from '../middleware/errorHandler';
import type { ApiResponse, PlaylistData } from '../types';

/**
 * Request Validation Schema using Zod
 */
const playlistRequestSchema = z.object({
  url: z.string().optional(),
  playlistId: z.string().optional(),
}).refine(
  (data) => data.url || data.playlistId,
  {
    message: 'Either url or playlistId must be provided',
  }
);

/**
 * Playlist Controller
 * Handles HTTP requests for playlist operations
 */
class PlaylistController {
  /**
   * GET /api/playlist
   * Fetch and calculate playlist data
   */
  async getPlaylist(
    req: Request,
    res: Response<ApiResponse<PlaylistData>>,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate request
      const validation = playlistRequestSchema.safeParse(req.query);
      
      if (!validation.success) {
        throw new AppError(
          validation.error.errors[0].message,
          400,
          'VALIDATION_ERROR'
        );
      }
      
      const { url, playlistId: directPlaylistId } = validation.data;
      
      // Extract playlist ID
      let playlistId: string | null = null;
      
      if (url) {
        playlistId = extractPlaylistId(url);
        if (!playlistId) {
          throw new AppError(
            'Invalid YouTube playlist URL',
            400,
            'INVALID_URL'
          );
        }
      } else if (directPlaylistId) {
        playlistId = directPlaylistId;
      }
      
      // Validate playlist ID format
      if (!playlistId || !isValidPlaylistId(playlistId)) {
        throw new AppError(
          'Invalid playlist ID format',
          400,
          'INVALID_PLAYLIST_ID'
        );
      }
      
      // Fetch playlist data from YouTube
      const data = await youtubeService.getPlaylistData(playlistId);
      
      // Return success response
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/health
   * Health check endpoint
   */
  async healthCheck(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
    });
  }
}

export const playlistController = new PlaylistController();
