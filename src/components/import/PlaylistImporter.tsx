import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { parsePlaylistFile } from '../../utils/fileUtils';
import { usePlaylistStore } from '../../store';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
import { Spinner } from '../ui/Spinner';

const PlaylistImporter: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { importPlaylist } = usePlaylistStore();
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };
  
  const processFile = async (file: File) => {
    setIsImporting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const playlistData = await parsePlaylistFile(file);
      
      if (!playlistData) {
        throw new Error('Failed to parse playlist file');
      }
      
      const playlistId = importPlaylist(playlistData);
      
      setSuccess(`Successfully imported "${playlistData.title}" with ${playlistData.data.length} videos`);
    } catch (err) {
      setError(`Error importing playlist: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div 
        className={`border-2 border-dashed rounded-md p-6 text-center ${
          isDragging 
            ? 'border-purple-500 bg-purple-900 bg-opacity-20' 
            : 'border-gray-600 hover:border-gray-500'
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          {isImporting ? (
            <Spinner size="md" color="primary" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400 mb-3" />
          )}
          
          <h3 className="text-lg font-medium text-white mb-2">
            {isDragging
              ? 'Drop your playlist file here'
              : 'Import your YouTube playlists'}
          </h3>
          
          <p className="text-sm text-gray-400 mb-4">
            Drag and drop your playlist file, or click to select
          </p>
          
          <p className="text-xs text-gray-500 mb-4">
            Supported formats: .json, .txt, .csv
          </p>
          
          <label>
            <Button 
              variant="secondary"
              disabled={isImporting}
              className="flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              {isImporting ? 'Importing...' : 'Select file'}
            </Button>
            <input
              type="file"
              className="hidden"
              accept=".json,.txt,.csv"
              onChange={handleFileChange}
              disabled={isImporting}
            />
          </label>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-700 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-900 bg-opacity-30 border border-green-700 rounded-md">
          <p className="text-sm text-green-300">{success}</p>
        </div>
      )}
    </motion.div>
  );
};

export default PlaylistImporter;