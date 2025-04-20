import React, { useEffect } from 'react';
import Layout from './components/layout/Layout';
import Library from './pages/Library';
import NowPlaying from './pages/NowPlaying';
import { usePlaylistStore } from './store';

function App() {
  const { playlists } = usePlaylistStore();
  
  // Try to load example playlists if none exist
  useEffect(() => {
    const loadSamplePlaylists = async () => {
      if (playlists.length === 0) {
        try {
          // For demonstration, we'll check if we can access the test playlist files
          const examplePlaylists = [
            { code: 'k328bk', title: 'SriVennelaWays' },
            { code: 'radzpm', title: 'Sound Of Isha' }
          ];
          
          // In a real application, this would be using the file system or an API
          // Here we're simulating this with localStorage
          for (const playlist of examplePlaylists) {
            const storageKey = `.bolt/config.json{"success":{"code":"${playlist.code}","data"`;
            const storedData = localStorage.getItem(storageKey);
            
            if (storedData) {
              // Parse the stored data
              try {
                const match = storedData.match(/"data":"([^"]+)"/);
                if (match && match[1]) {
                  const decodedData = JSON.parse(decodeURIComponent(match[1]));
                  if (decodedData.title && Array.isArray(decodedData.data)) {
                    // Import the playlist
                    usePlaylistStore.getState().importPlaylist(decodedData);
                    console.log(`Imported sample playlist: ${decodedData.title}`);
                  }
                }
              } catch (e) {
                console.error('Error parsing stored playlist data:', e);
              }
            }
          }
        } catch (e) {
          console.error('Error loading sample playlists:', e);
        }
      }
    };
    
    loadSamplePlaylists();
  }, [playlists.length]);
  
  return (
    <Layout>
      <section id="playlists" className="py-8">
        <Library />
      </section>
      
      <section id="nowplaying" className="py-8 bg-gray-900">
        <NowPlaying />
      </section>
    </Layout>
  );
}

export default App;