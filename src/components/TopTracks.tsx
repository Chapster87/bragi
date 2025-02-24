import { useEffect, useState } from 'react';

import Spotify from '@/services/spotify'
import Track from '@/components/Track';

const spotify = new Spotify();

export default function TopTracks() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    spotify.fetchTopTracks()
      .then(response => {
        console.log(response);
        setTracks(response.items);
      });
  }, []);

  return (
    <>
      {tracks && tracks.length > 0 &&
        <>
          <h2 className="block font-bold text-lg mb-2">Top Tracks:</h2>
          <div className="flex flex-wrap gap-2">
            {tracks.map((track) => (
              <Track track={track} key={track.id} />
            ))}
          </div>
        </>
      }
    </>
  )
}