import React, { useState } from 'react';
import { Menu, X, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Music className="text-purple-500 h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold text-white">TubePlayer</h1>
        </div>
        
        <div className="md:hidden">
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="#playlists" className="text-gray-300 hover:text-white transition-colors duration-200">
            My Playlists
          </a>
          <a href="#import" className="text-gray-300 hover:text-white transition-colors duration-200">
            Import
          </a>
          <a href="#nowplaying" className="text-gray-300 hover:text-white transition-colors duration-200">
            Now Playing
          </a>
        </nav>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <nav className="flex flex-col space-y-4 px-4 py-4 bg-gray-800">
              <a 
                href="#playlists" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                My Playlists
              </a>
              <a 
                href="#import" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Import
              </a>
              <a 
                href="#nowplaying" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Now Playing
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;