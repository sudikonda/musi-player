import React from 'react';
import { Heart, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-4 text-center text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center space-x-1 mb-2">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-red-500" />
          <span>using React + TypeScript</span>
        </div>
        <div className="flex justify-center items-center space-x-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-white transition-colors duration-200"
          >
            <Github className="h-4 w-4 mr-1" />
            <span>Source</span>
          </a>
          <span>|</span>
          <span>TubePlayer &copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;