import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Repeat1
} from 'lucide-react';
import { usePlayerStore } from '../../store';
import { formatTime } from '../../utils/fileUtils';

const PlayerControls: React.FC = () => {
  const { 
    isPlaying,
    togglePlay,
    nextVideo,
    previousVideo,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    repeatMode,
    cycleRepeatMode,
    isShuffled,
    toggleShuffle,
    progress,
    duration
  } = usePlayerStore();

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This would need additional YouTube player integration
    // to actually seek to the position
    const newProgress = parseFloat(e.target.value);
    // In a full implementation, you would call player.seekTo(newProgress)
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseInt(e.target.value, 10));
  };

  // Repeat icon based on mode
  const RepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return <Repeat1 className="w-5 h-5" />;
      case 'all':
        return <Repeat className="w-5 h-5 text-purple-400" />;
      default:
        return <Repeat className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full px-2 py-3 bg-gray-800 rounded-md">
      {/* Progress bar */}
      <div className="flex items-center mb-2 px-2">
        <span className="text-xs text-gray-400 mr-2">
          {formatTime(progress)}
        </span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={progress}
          onChange={handleProgressChange}
          className="flex-grow h-2 rounded-md bg-gray-700 appearance-none cursor-pointer"
          style={{
            backgroundImage: `linear-gradient(to right, #8b5cf6 ${(progress / (duration || 100)) * 100}%, #374151 ${(progress / (duration || 100)) * 100}%)`,
          }}
        />
        <span className="text-xs text-gray-400 ml-2">
          {formatTime(duration)}
        </span>
      </div>

      {/* Control buttons */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-full ${isShuffled ? 'text-purple-400' : 'text-gray-400'} hover:text-white focus:outline-none`}
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button
            onClick={cycleRepeatMode}
            className={`p-2 rounded-full ${repeatMode !== 'off' ? 'text-purple-400' : 'text-gray-400'} hover:text-white focus:outline-none`}
          >
            <RepeatIcon />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={previousVideo}
            className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button
            onClick={togglePlay}
            className="p-3 bg-purple-600 rounded-full text-white hover:bg-purple-700 focus:outline-none transition-all duration-200 transform hover:scale-105"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          
          <button
            onClick={nextVideo}
            className="p-2 rounded-full text-gray-300 hover:text-white focus:outline-none"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full text-gray-400 hover:text-white focus:outline-none"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 rounded-md appearance-none cursor-pointer bg-gray-700"
            style={{
              backgroundImage: `linear-gradient(to right, #8b5cf6 ${isMuted ? 0 : volume}%, #374151 ${isMuted ? 0 : volume}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;