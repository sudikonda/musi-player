import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import SoundOfIsha from './data/Sound-Of-Isha.json';
import SriVennelaWays from './data/SriVennelaWays.json';
import usePlaylistStore from './store/playlistStore';
import { Video } from './types';

const soundOfIshaVideos: Video[] = SoundOfIsha.map(item => ({
  id: item.video_id,
  title: item.video_name,
  thumbnail: `https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`,
  duration: item.video_duration,
  creator: item.video_creator,
}));

const sriVennelaWaysVideos: Video[] = SriVennelaWays.map(item => ({
  id: item.video_id,
  title: item.video_name,
  thumbnail: `https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`,
  duration: item.video_duration,
  creator: item.video_creator,
}));

const playlists = [
  {
    id: 'sound-of-isha',
    title: 'Sound Of Isha',
    videos: soundOfIshaVideos,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'sri-vennela-ways',
    title: 'Sri Vennela Ways',
    videos: sriVennelaWaysVideos,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

usePlaylistStore.getState().setPlaylists(playlists);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
