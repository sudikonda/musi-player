import { ImportedPlaylistData } from '../types';

export const parsePlaylistFile = async (file: File): Promise<ImportedPlaylistData | null> => {
  try {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileContent = await readFile(file);

    switch (fileExtension) {
      case 'json':
        return parseJsonPlaylist(fileContent);
      case 'txt':
        return parseTxtPlaylist(fileContent, file.name);
      case 'csv':
        return parseCsvPlaylist(fileContent, file.name);
      default:
        throw new Error(`Unsupported file format: ${fileExtension}`);
    }
  } catch (error) {
    console.error('Error parsing playlist file:', error);
    return null;
  }
};

const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('File reading error'));
    };
    
    reader.readAsText(file);
  });
};

const parseJsonPlaylist = (content: string): ImportedPlaylistData => {
  try {
    const parsedData = JSON.parse(content);
    
    // Handle different JSON formats
    if (parsedData.title && Array.isArray(parsedData.data)) {
      return parsedData;
    } else if (Array.isArray(parsedData)) {
      // Assume it's an array of videos
      return {
        title: 'Imported Playlist',
        data: parsedData.map((video) => ({
          video_id: video.id || video.videoId || video.video_id,
          video_name: video.title || video.name || video.video_name,
          video_creator: video.creator || video.channel || video.author || 'Unknown',
          video_duration: parseInt(video.duration || video.length || '0', 10),
        })),
      };
    }
    
    throw new Error('Invalid JSON format');
  } catch (error) {
    console.error('JSON parsing error:', error);
    throw error;
  }
};

const parseTxtPlaylist = (content: string, fileName: string): ImportedPlaylistData => {
  // Assuming each line contains a YouTube video URL or ID
  const lines = content.split('\n').filter(line => line.trim());
  
  const data = lines.map((line) => {
    // Extract video ID from URLs like https://www.youtube.com/watch?v=VIDEO_ID
    const videoIdMatch = line.match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?v=)([^&\s]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : line.trim();
    
    return {
      video_id: videoId,
      video_name: 'Unknown Title', // These will be filled in from YouTube API later
      video_creator: 'Unknown Creator',
      video_duration: 0,
    };
  });
  
  return {
    title: fileName.replace(/\.[^/.]+$/, '') || 'Imported Playlist',
    data,
  };
};

const parseCsvPlaylist = (content: string, fileName: string): ImportedPlaylistData => {
  const lines = content.split('\n').filter(line => line.trim());
  
  // Try to determine columns from header
  const header = lines[0].split(',');
  const hasHeader = /id|url|title|name|duration|creator|channel/i.test(header.join(','));
  
  const dataStartIndex = hasHeader ? 1 : 0;
  const data = [];
  
  for (let i = dataStartIndex; i < lines.length; i++) {
    const values = lines[i].split(',');
    
    if (values.length < 1) continue;
    
    // Attempt to find the video ID column
    let videoId = '';
    let videoName = 'Unknown Title';
    let videoCreator = 'Unknown Creator';
    let videoDuration = 0;
    
    if (hasHeader) {
      // Map values based on header
      for (let j = 0; j < header.length; j++) {
        const column = header[j].toLowerCase();
        const value = values[j];
        
        if (/video_?id|id/i.test(column)) {
          videoId = value;
        } else if (/title|name/i.test(column)) {
          videoName = value;
        } else if (/creator|channel|author/i.test(column)) {
          videoCreator = value;
        } else if (/duration|length/i.test(column)) {
          videoDuration = parseInt(value, 10) || 0;
        } else if (/url|link/i.test(column)) {
          // Extract ID from URL
          const videoIdMatch = value.match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?v=)([^&\s]+)/);
          if (videoIdMatch) {
            videoId = videoIdMatch[1];
          }
        }
      }
    } else {
      // No header, try to determine what each value is
      if (values[0].includes('youtu')) {
        // First column is URL
        const videoIdMatch = values[0].match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/watch\?v=)([^&\s]+)/);
        if (videoIdMatch) {
          videoId = videoIdMatch[1];
        } else {
          videoId = values[0];
        }
      } else {
        videoId = values[0];
      }
      
      if (values.length > 1) videoName = values[1];
      if (values.length > 2) videoCreator = values[2];
      if (values.length > 3) videoDuration = parseInt(values[3], 10) || 0;
    }
    
    data.push({
      video_id: videoId,
      video_name: videoName,
      video_creator: videoCreator,
      video_duration: videoDuration,
    });
  }
  
  return {
    title: fileName.replace(/\.[^/.]+$/, '') || 'Imported Playlist',
    data,
  };
};

export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds === Infinity) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const formattedMins = mins < 10 && hrs > 0 ? `0${mins}` : mins;
  const formattedSecs = secs < 10 ? `0${secs}` : secs;
  
  return hrs > 0 
    ? `${hrs}:${formattedMins}:${formattedSecs}` 
    : `${formattedMins}:${formattedSecs}`;
};