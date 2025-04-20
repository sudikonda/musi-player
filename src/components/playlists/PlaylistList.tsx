import React from 'react';
import PlaylistItem from './PlaylistItem';
import { Playlist } from '../../types';
import { motion } from 'framer-motion';

interface PlaylistListProps {
  playlists: Playlist[];
  onPlayPlaylist: (id: string) => void;
  onDeletePlaylist: (id: string) => void;
  activePlaylistId?: string | null;
}

const PlaylistList: React.FC<PlaylistListProps> = ({
  playlists,
  onPlayPlaylist,
  onDeletePlaylist,
  activePlaylistId,
}) => {
  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No playlists found.</p>
        <p className="text-gray-500 text-sm mt-2">
          Import a playlist or create a new one to get started.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {playlists.map((playlist) => (
        <PlaylistItem
          key={playlist.id}
          playlist={playlist}
          onPlay={onPlayPlaylist}
          onDelete={onDeletePlaylist}
          isActive={playlist.id === activePlaylistId}
        />
      ))}
    </motion.div>
  );
};

export default PlaylistList;