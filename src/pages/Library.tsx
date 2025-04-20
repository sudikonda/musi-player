import React, { useState } from 'react';
import PlaylistList from '../components/playlists/PlaylistList';
import PlaylistImporter from '../components/import/PlaylistImporter';
import { usePlaylistStore, usePlayerStore } from '../store';
import Button from '../components/ui/Button';
import { PlusCircle, Import } from 'lucide-react';
import { motion } from 'framer-motion';

const Library: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'playlists' | 'import'>('playlists');
  
  const { playlists, addPlaylist, deletePlaylist } = usePlaylistStore();
  const { setCurrentPlaylistId, setCurrentVideoIndex, setIsPlaying } = usePlayerStore();
  
  const handlePlayPlaylist = (id: string) => {
    setCurrentPlaylistId(id);
    setCurrentVideoIndex(0);
    setIsPlaying(true);
    
    // Scroll to the player section
    document.getElementById('nowplaying')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };
  
  const handleAddPlaylist = () => {
    const name = prompt('Enter a name for your new playlist:');
    if (name) {
      addPlaylist(name);
    }
  };
  
  return (
    <motion.div 
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">
          Your Music Library
        </h1>
        
        <div className="flex space-x-4">
          <Button 
            variant="primary" 
            onClick={handleAddPlaylist}
            className="flex items-center"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Playlist
          </Button>
          
          <Button
            variant={activeTab === 'import' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('import')}
            className="flex items-center"
          >
            <Import className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 mb-8">
        {activeTab === 'playlists' ? (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">Your Playlists</h2>
            <PlaylistList
              playlists={playlists}
              onPlayPlaylist={handlePlayPlaylist}
              onDeletePlaylist={deletePlaylist}
            />
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">Import Playlists</h2>
            <PlaylistImporter />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Library;