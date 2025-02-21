import { useEffect, useState } from 'react';
import Image from 'next/image'

import Spotify from '@/services/spotify'

export default function TopTracks() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const spotify = new Spotify();
    spotify.fetchTopTracks()
      .then(response => {
        setTracks(response.items);
      });
  }, []);

  return (
    <>
      {tracks && tracks.length > 0 &&
        <>
          <h2>Top Tracks</h2>
          <div className="flex flex-wrap gap-2">
            {tracks.map((track) => (
              <div className="flex items-center w-full" key={track.id}>
                <Image src={track.album.images[0].url} alt={track.name} width={60} height={60} />
                <div className="ml-3">
                  <h3 className="text-base font-bold">{track.name}</h3>
                  <p className="italic text-sm">{track.artists.map((artist) => artist.name).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      }
    </>
  )
}