/**
 * Type Definitions for Backend
 */

// YouTube API Response Types
export interface YouTubeVideoItem {
  contentDetails: {
    videoId: string;
    videoPublishedAt: string;
  };
}

export interface YouTubePlaylistResponse {
  items: YouTubeVideoItem[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeVideoDetailsResponse {
  items: Array<{
    id: string;
    contentDetails: {
      duration: string; // ISO 8601 format (PT1H2M3S)
    };
    snippet: {
      title: string;
    };
  }>;
}

export interface YouTubePlaylistDetailsResponse {
  items: Array<{
    snippet: {
      title: string;
      description: string;
    };
  }>;
}

// Application Types
export interface VideoData {
  id: string;
  title: string;
  duration: number; // in seconds
}

export interface SpeedDurations {
  '1': string;
  '1.25': string;
  '1.5': string;
  '1.75': string;
  '2': string;
}

export interface PlaylistData {
  title: string;
  videoCount: number;
  totalDuration: number; // in seconds
  totalDurationFormatted: string;
  averageVideoLength: number; // in seconds
  averageVideoLengthFormatted: string;
  speeds: SpeedDurations;
  videos?: VideoData[]; // Optional: include video list
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}

// Request/Response Types
export interface PlaylistRequest {
  url?: string;
  playlistId?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}
