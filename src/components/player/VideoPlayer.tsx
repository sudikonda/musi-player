import React, { useRef, useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { usePlayerStore } from '../../store';
import { Spinner } from '../ui/Spinner';

interface VideoPlayerProps {
  videoId: string;
  onVideoEnd?: () => void;
  onVideoReady?: () => void;
  onVideoError?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  onVideoEnd,
  onVideoReady,
  onVideoError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<any>(null);
  
  const { 
    isPlaying, 
    volume, 
    isMuted, 
    setDuration,
    setProgress
  } = usePlayerStore();
  
  // Update player state based on store
  useEffect(() => {
    if (!playerRef.current) return;
    
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (e) {
      console.error('Error controlling player:', e);
    }
  }, [isPlaying]);
  
  useEffect(() => {
    if (!playerRef.current) return;
    
    try {
      playerRef.current.setVolume(isMuted ? 0 : volume);
    } catch (e) {
      console.error('Error setting volume:', e);
    }
  }, [volume, isMuted]);
  
  // Track progress
  useEffect(() => {
    if (!playerRef.current || !isPlaying) return;
    
    const interval = setInterval(() => {
      try {
        const currentTime = playerRef.current.getCurrentTime() || 0;
        setProgress(currentTime);
      } catch (e) {
        console.error('Error getting current time:', e);
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, setProgress]);
  
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      fs: 0,
      iv_load_policy: 3,
    },
  };
  
  const handleReady = (event: any) => {
    playerRef.current = event.target;
    setIsLoading(false);
    
    // Set initial volume
    playerRef.current.setVolume(isMuted ? 0 : volume);
    
    // Set duration
    const duration = playerRef.current.getDuration();
    setDuration(duration);
    
    // Cache this video for offline
    try {
      const thumbnail = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      
      // In a real app, you'd implement more sophisticated caching
      const cachedVideos = JSON.parse(localStorage.getItem('cachedVideos') || '{}');
      localStorage.setItem('cachedVideos', JSON.stringify({
        ...cachedVideos,
        [videoId]: {
          id: videoId,
          thumbnail,
          cachedAt: Date.now(),
        }
      }));
    } catch (e) {
      console.error('Error caching video:', e);
    }
    
    if (onVideoReady) onVideoReady();
    
    // Start playing if needed
    if (isPlaying) {
      playerRef.current.playVideo();
    }
  };
  
  const handleError = (event: any) => {
    console.error('YouTube player error:', event);
    setError('Error loading video. Please try again.');
    setIsLoading(false);
    if (onVideoError) onVideoError();
  };
  
  const handleEnd = () => {
    if (onVideoEnd) onVideoEnd();
  };
  
  return (
    <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <Spinner size="lg" />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-red-500">
          <p>{error}</p>
        </div>
      )}
      
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onError={handleError}
        onEnd={handleEnd}
        className="w-full h-full"
      />
    </div>
  );
};

export default VideoPlayer;