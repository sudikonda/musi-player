import React from 'react';
import { Play, MoreVertical, Trash2 } from 'lucide-react';
import { Playlist } from '../../types';
import { motion } from 'framer-motion';

interface PlaylistItemProps {
  playlist: Playlist;
  onPlay: (id: string) => void;
  onDelete: (id: string) => void;
  isActive?: boolean;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  playlist,
  onPlay,
  onDelete,
  isActive = false,
}) => {
  const [showOptions, setShowOptions] = React.useState(false);
  
  // Calculate total duration
  const totalDuration = playlist.videos.reduce((total, video) => {
    return total + (video.duration || 0);
  }, 0);
  
  // Format the duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    return hours > 0 
      ? `${hours} hr ${minutes} min` 
      : `${minutes} min`;
  };
  
  // Get a thumbnail from the first video
  const thumbnail = playlist.videos.length > 0
    ? `https://img.youtube.com/vi/${playlist.videos[0].id}/mqdefault.jpg`
    : '';
  
  return (
    <motion.div 
      className={`relative bg-gray-800 rounded-md overflow-hidden shadow-md ${
        isActive ? 'ring-2 ring-purple-500' : ''
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-video">
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={playlist.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400">No thumbnail</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={() => onPlay(playlist.id)}
            className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors duration-200"
          >
            <Play className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-white truncate">{playlist.title}</h3>
            <p className="text-sm text-gray-400">
              {playlist.videos.length} {playlist.videos.length === 1 ? 'video' : 'videos'} • {formatDuration(totalDuration)}
            </p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 text-gray-400 hover:text-white focus:outline-none"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 mt-1 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onDelete(playlist.id);
                      setShowOptions(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-gray-600 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete playlist
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaylistItem;