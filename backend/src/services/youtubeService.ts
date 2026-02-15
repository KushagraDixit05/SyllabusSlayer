import config from '../config/config';
import { AppError } from '../middleware/errorHandler';
import {
  parseISO8601Duration,
  formatDurationText,
  calculateSpeedDurations,
  calculateAverage,
} from '../utils/durationCalculator';
import type {
  YouTubePlaylistResponse,
  YouTubeVideoDetailsResponse,
  YouTubePlaylistDetailsResponse,
  PlaylistData,
  VideoData,
} from '../types';

/**
 * YouTube Service
 * Handles all interactions with YouTube Data API
 */
class YouTubeService {
  private readonly baseUrl = config.youtube.baseUrl;
  private readonly apiKey = config.youtube.apiKey;
  private readonly maxResults = config.youtube.maxResults;

  /**
   * Fetch playlist details (title, description)
   */
  private async fetchPlaylistDetails(playlistId: string): Promise<string> {
    const url = `${this.baseUrl}/playlists?part=snippet&id=${playlistId}&key=${this.apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new AppError('YouTube API quota exceeded', 429, 'QUOTA_EXCEEDED');
      }
      if (response.status === 404) {
        throw new AppError('Playlist not found', 404, 'PLAYLIST_NOT_FOUND');
      }
      throw new AppError('Failed to fetch playlist details', 500, 'API_ERROR');
    }
    
    const data: YouTubePlaylistDetailsResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new AppError('Playlist not found or is private', 404, 'PLAYLIST_NOT_FOUND');
    }
    
    return data.items[0].snippet.title;
  }

  /**
   * Fetch all video IDs from a playlist (handles pagination)
   */
  private async fetchAllVideoIds(playlistId: string): Promise<string[]> {
    let videoIds: string[] = [];
    let nextPageToken: string | undefined;
    
    do {
      const url = `${this.baseUrl}/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=${this.maxResults}&key=${this.apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new AppError('YouTube API quota exceeded', 429, 'QUOTA_EXCEEDED');
        }
        if (response.status === 404) {
          throw new AppError('Playlist not found', 404, 'PLAYLIST_NOT_FOUND');
        }
        throw new AppError('Failed to fetch playlist items', 500, 'API_ERROR');
      }
      
      const data: YouTubePlaylistResponse = await response.json();
      
      if (!data.items || data.items.length === 0) {
        break;
      }
      
      videoIds = videoIds.concat(
        data.items.map((item) => item.contentDetails.videoId)
      );
      
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);
    
    return videoIds;
  }

  /**
   * Fetch video details (duration, title) in batches
   */
  private async fetchVideoDetails(videoIds: string[]): Promise<VideoData[]> {
    const videos: VideoData[] = [];
    
    // Process in batches of 50 (YouTube API limit)
    for (let i = 0; i < videoIds.length; i += 50) {
      const batch = videoIds.slice(i, i + 50);
      const url = `${this.baseUrl}/videos?part=contentDetails,snippet&id=${batch.join(',')}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new AppError('YouTube API quota exceeded', 429, 'QUOTA_EXCEEDED');
        }
        throw new AppError('Failed to fetch video details', 500, 'API_ERROR');
      }
      
      const data: YouTubeVideoDetailsResponse = await response.json();
      
      videos.push(
        ...data.items.map((item) => ({
          id: item.id,
          title: item.snippet.title,
          duration: parseISO8601Duration(item.contentDetails.duration),
        }))
      );
    }
    
    return videos;
  }

  /**
   * Get complete playlist data with calculations
   */
  async getPlaylistData(playlistId: string): Promise<PlaylistData> {
    // Fetch playlist title
    const title = await this.fetchPlaylistDetails(playlistId);
    
    // Fetch all video IDs
    const videoIds = await this.fetchAllVideoIds(playlistId);
    
    if (videoIds.length === 0) {
      throw new AppError('Playlist is empty', 400, 'EMPTY_PLAYLIST');
    }
    
    // Fetch video details
    const videos = await this.fetchVideoDetails(videoIds);
    
    // Calculate total duration
    const totalDuration = videos.reduce((sum, video) => sum + video.duration, 0);
    
    // Calculate average video length
    const averageVideoLength = calculateAverage(totalDuration, videos.length);
    
    // Calculate speed-adjusted durations
    const speeds = calculateSpeedDurations(totalDuration);
    
    return {
      title,
      videoCount: videos.length,
      totalDuration,
      totalDurationFormatted: formatDurationText(totalDuration),
      averageVideoLength,
      averageVideoLengthFormatted: formatDurationText(averageVideoLength),
      speeds,
      videos, // Include video list for potential future use
    };
  }
}

export const youtubeService = new YouTubeService();
