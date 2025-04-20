import { create } from 'zustand';
import { PlayerState, RepeatMode } from '../types';

interface PlayerStore extends PlayerState {
  setIsPlaying: (isPlaying: boolean) => void;
  togglePlay: () => void;
  setCurrentVideoIndex: (index: number) => void;
  nextVideo: () => void;
  previousVideo: () => void;
  setCurrentPlaylistId: (id: string | null) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  cycleRepeatMode: () => void;
  toggleShuffle: () => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
}

const usePlayerStore = create<PlayerStore>((set, get) => ({
  isPlaying: false,
  currentVideoIndex: 0,
  currentPlaylistId: null,
  volume: 100,
  isMuted: false,
  repeatMode: 'off',
  isShuffled: false,
  progress: 0,
  duration: 0,

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setCurrentVideoIndex: (index) => set({ currentVideoIndex: index }),
  
  nextVideo: () => {
    // Logic will be implemented in the player component
    // to handle playlist boundaries and shuffle mode
    set((state) => ({ currentVideoIndex: state.currentVideoIndex + 1 }));
  },
  
  previousVideo: () => {
    set((state) => ({ 
      currentVideoIndex: Math.max(0, state.currentVideoIndex - 1) 
    }));
  },
  
  setCurrentPlaylistId: (id) => set({ currentPlaylistId: id }),
  
  setVolume: (volume) => set({ volume }),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  
  cycleRepeatMode: () => {
    set((state) => {
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const currentIndex = modes.indexOf(state.repeatMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      return { repeatMode: modes[nextIndex] };
    });
  },
  
  toggleShuffle: () => set((state) => ({ isShuffled: !state.isShuffled })),
  
  setProgress: (progress) => set({ progress }),
  
  setDuration: (duration) => set({ duration }),
}));

export default usePlayerStore;