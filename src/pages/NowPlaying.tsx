import React, { useEffect, useMemo } from 'react';
import VideoPlayer from '../components/player/VideoPlayer';
import PlayerControls from '../components/player/PlayerControls';
import PlaylistVideoItem from '../components/playlists/PlaylistVideoItem';
import { usePlayerStore, usePlaylistStore } from '../store';
import Button from '../components/ui/Button';
import { ListMusic, Shuffle } from 'lucide-react';
import { motion } from 'framer-motion';

const NowPlaying: React.FC = () => {
  const { 
    currentPlaylistId, 
    currentVideoIndex, 
    isPlaying,
    setIsPlaying,
    nextVideo,
    setCurrentVideoIndex,
    isShuffled,
    toggleShuffle,
    repeatMode,
  } = usePlayerStore();
  
  const { playlists, getPlaylist, removeVideoFromPlaylist } = usePlaylistStore();
  
  // Get current playlist
  const currentPlaylist = useMemo(() => {
    return currentPlaylistId 
      ? getPlaylist(currentPlaylistId)
      : playlists.length > 0 
        ? playlists[0] 
        : undefined;
  }, [currentPlaylistId, playlists, getPlaylist]);
  
  // Get current video
  const currentVideo = useMemo(() => {
    if (!currentPlaylist || !currentPlaylist.videos.length) return null;
    
    // Ensure index is valid
    const validIndex = Math.min(currentVideoIndex, currentPlaylist.videos.length - 1);
    return currentPlaylist.videos[validIndex];
  }, [currentPlaylist, currentVideoIndex]);
  
  const handleVideoEnd = () => {
    if (repeatMode === 'one') {
      // Replay the same video
      setIsPlaying(true);
      return;
    }
    
    if (!currentPlaylist || !currentPlaylist.videos.length) return;
    
    if (currentVideoIndex < currentPlaylist.videos.length - 1) {
      // Play next video
      nextVideo();
    } else if (repeatMode === 'all') {
      // Start over from beginning
      setCurrentVideoIndex(0);
    } else {
      // Stop playing
      setIsPlaying(false);
    }
  };
  
  const handlePlayVideo = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
  };
  
  const handleRemoveVideo = (videoId: string) => {
    if (!currentPlaylistId) return;
    
    removeVideoFromPlaylist(currentPlaylistId, videoId);
    
    // If removed current video, play next one if available
    if (currentVideo && currentVideo.id === videoId) {
      handleVideoEnd();
    }
  };
  
  const shufflePlaylist = () => {
    toggleShuffle();
    // In a full implementation, you would reorder the array here
  };
  
  useEffect(() => {
    // Set document title
    if (currentVideo) {
      document.title = `${currentVideo.title} | TubePlayer`;
    } else {
      document.title = 'TubePlayer';
    }
    
    return () => {
      document.title = 'TubePlayer';
    };
  }, [currentVideo]);
  
  if (!currentPlaylist || !currentPlaylist.videos.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-[60vh]">
        <ListMusic className="h-16 w-16 text-gray-500 mb-4" />
        <h2 className="text-xl font-medium text-gray-300 mb-2">No playlist selected</h2>
        <p className="text-gray-500 text-center mb-6">
          Import a playlist or create a new one to start playing
        </p>
      </div>
    );
  }
  
  if (!currentVideo) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-[60vh]">
        <ListMusic className="h-16 w-16 text-gray-500 mb-4" />
        <h2 className="text-xl font-medium text-gray-300 mb-2">No videos in this playlist</h2>
        <p className="text-gray-500 text-center mb-6">
          Add videos to this playlist to start playing
        </p>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <VideoPlayer
              videoId={currentVideo.id}
              onVideoEnd={handleVideoEnd}
              onVideoError={() => handleVideoEnd()}
            />
          </div>
          
          <PlayerControls />
          
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-medium text-white mb-1">
              {currentVideo.title}
            </h2>
            <p className="text-sm text-gray-400">
              {currentVideo.creator}
            </p>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="font-medium text-white">
                {currentPlaylist.title} ({currentPlaylist.videos.length} videos)
              </h3>
              
              <Button
                variant="outline"
                size="sm"
                onClick={shufflePlaylist}
                className={isShuffled ? 'bg-purple-800 bg-opacity-30' : ''}
              >
                <Shuffle className="h-4 w-4 mr-1" />
                Shuffle
              </Button>
            </div>
            
            <div className="h-[60vh] overflow-y-auto">
              {currentPlaylist.videos.map((video, index) => (
                <PlaylistVideoItem
                  key={`${video.id}-${index}`}
                  video={video}
                  isActive={currentVideoIndex === index}
                  onPlay={() => handlePlayVideo(index)}
                  onRemove={() => handleRemoveVideo(video.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NowPlaying;