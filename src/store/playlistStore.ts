import { create } from 'zustand';
import { Playlist, Video, ImportedPlaylistData } from '../types';
import { persist } from 'zustand/middleware';

interface PlaylistStore {
  playlists: Playlist[];
  setPlaylists: (playlists: Playlist[]) => void;
  getPlaylist: (id: string) => Playlist | undefined;
  addPlaylist: (title: string, videos?: Video[]) => string;
  updatePlaylist: (id: string, updates: Partial<Omit<Playlist, 'id'>>) => void;
  deletePlaylist: (id: string) => void;
  addVideoToPlaylist: (playlistId: string, video: Video) => void;
  removeVideoFromPlaylist: (playlistId: string, videoId: string) => void;
  reorderPlaylistVideos: (playlistId: string, startIndex: number, endIndex: number) => void;
  importPlaylist: (data: ImportedPlaylistData) => string;
  cacheVideoData: (videoId: string, data: Partial<Video>) => void;
  getCachedVideoData: (videoId: string) => Partial<Video> | undefined;
}

const usePlaylistStore = create<PlaylistStore>()(
  persist(
    (set, get) => ({
      playlists: [],
      cachedVideos: {},

      setPlaylists: (playlists) => {
        set({ playlists });
      },

      getPlaylist: (id) => {
        return get().playlists.find(playlist => playlist.id === id);
      },

      addPlaylist: (title, videos = []) => {
        const id = Date.now().toString();
        const now = Date.now();
        const newPlaylist: Playlist = {
          id,
          title,
          videos,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          playlists: [...state.playlists, newPlaylist],
        }));

        return id;
      },

      updatePlaylist: (id, updates) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === id
              ? { ...playlist, ...updates, updatedAt: Date.now() }
              : playlist
          ),
        }));
      },

      deletePlaylist: (id) => {
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== id),
        }));
      },

      addVideoToPlaylist: (playlistId, video) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  videos: [...playlist.videos, video],
                  updatedAt: Date.now(),
                }
              : playlist
          ),
        }));
      },

      removeVideoFromPlaylist: (playlistId, videoId) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  videos: playlist.videos.filter((v) => v.id !== videoId),
                  updatedAt: Date.now(),
                }
              : playlist
          ),
        }));
      },

      reorderPlaylistVideos: (playlistId, startIndex, endIndex) => {
        set((state) => {
          const playlist = state.playlists.find((p) => p.id === playlistId);
          if (!playlist) return state;

          const newVideos = [...playlist.videos];
          const [removed] = newVideos.splice(startIndex, 1);
          newVideos.splice(endIndex, 0, removed);

          return {
            playlists: state.playlists.map((p) =>
              p.id === playlistId
                ? { ...p, videos: newVideos, updatedAt: Date.now() }
                : p
            ),
          };
        });
      },

      importPlaylist: (data) => {
        const videos: Video[] = data.data.map((item) => ({
          id: item.video_id,
          title: item.video_name,
          thumbnail: `https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`,
          duration: item.video_duration,
          creator: item.video_creator,
        }));

        return get().addPlaylist(data.title, videos);
      },

      cacheVideoData: (videoId, data) => {
        const cachedVideos = localStorage.getItem('cachedVideos') || '{}';
        const parsed = JSON.parse(cachedVideos);
        
        localStorage.setItem('cachedVideos', JSON.stringify({
          ...parsed,
          [videoId]: { ...parsed[videoId], ...data, cachedAt: Date.now() }
        }));
      },

      getCachedVideoData: (videoId) => {
        const cachedVideos = localStorage.getItem('cachedVideos') || '{}';
        const parsed = JSON.parse(cachedVideos);
        return parsed[videoId];
      }
    }),
    {
      name: 'youtube-player-storage',
    }
  )
);

export default usePlaylistStore;
