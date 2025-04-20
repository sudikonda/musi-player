export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  creator: string;
}

export interface Playlist {
  id: string;
  title: string;
  videos: Video[];
  createdAt: number;
  updatedAt: number;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  isPlaying: boolean;
  currentVideoIndex: number;
  currentPlaylistId: string | null;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffled: boolean;
  progress: number;
  duration: number;
}

export interface ImportedPlaylistData {
  title: string;
  data: {
    video_id: string;
    video_name: string;
    video_creator: string;
    video_duration: number;
  }[];
}