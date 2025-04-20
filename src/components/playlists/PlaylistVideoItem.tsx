import React from 'react';
import { Video } from '../../types';
import { Play, Trash, MoreVertical } from 'lucide-react';
import { formatTime } from '../../utils/fileUtils';
import { motion } from 'framer-motion';

interface PlaylistVideoItemProps {
  video: Video;
  isActive?: boolean;
  onPlay: () => void;
  onRemove: () => void;
}

const PlaylistVideoItem: React.FC<PlaylistVideoItemProps> = ({
  video,
  isActive = false,
  onPlay,
  onRemove,
}) => {
  const [showOptions, setShowOptions] = React.useState(false);
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay();
  };
  
  return (
    <motion.div 
      className={`flex items-center p-3 rounded-md ${
        isActive 
          ? 'bg-purple-900 bg-opacity-40' 
          : 'bg-gray-800 hover:bg-gray-700'
      } cursor-pointer transition-colors duration-200 group`}
      onClick={onPlay}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative flex-shrink-0 w-24 h-16 rounded overflow-hidden mr-3">
        <img
          src={video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handlePlayClick}
            className="p-1.5 bg-purple-600 rounded-full text-white"
          >
            <Play className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-grow min-w-0">
        <h3 className="text-sm font-medium text-white truncate">{video.title}</h3>
        <p className="text-xs text-gray-400 truncate">{video.creator}</p>
        {video.duration > 0 && (
          <p className="text-xs text-gray-500">{formatTime(video.duration)}</p>
        )}
      </div>
      
      <div className="relative flex-shrink-0 ml-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="p-1.5 text-gray-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-gray-600"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        
        {showOptions && (
          <div className="absolute right-0 mt-1 w-40 bg-gray-700 rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                  setShowOptions(false);
                }}
                className="w-full px-3 py-2 text-xs text-left text-red-400 hover:bg-gray-600 flex items-center"
              >
                <Trash className="h-3 w-3 mr-2" />
                Remove from playlist
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlaylistVideoItem;