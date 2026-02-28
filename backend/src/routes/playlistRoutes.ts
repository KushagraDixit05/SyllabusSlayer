import { Router } from 'express';
import { playlistController } from '../controllers/playlistController';

const router = Router();

/**
 * @route   GET /api/playlist
 * @desc    Get playlist data with duration calculations
 * @query   url OR playlistId
 * @access  Public
 */
router.get('/playlist', playlistController.getPlaylist.bind(playlistController));

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', playlistController.healthCheck.bind(playlistController));

export default router;
