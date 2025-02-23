import { useEffect, useState } from 'react';
import Image from 'next/image'

import Spotify from '@/services/spotify'

export default function TopTracks() {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const spotify = new Spotify();
    const getQueue = async () => {
    spotify.fetchUserQueue()
      .then(response => {
        setNowPlaying(response.currently_playing);
        setQueue(response.queue);
      });
    };

    let updateQueue = setInterval(() => {
      getQueue();

      // if (queue === null) {
      //   clearInterval(updateQueue);
      // }
    }, 1000);

  }, []);

  return (
    <>
      {nowPlaying && 
        <div className="now-playing mb-6">
          <h2 className="block font-bold text-lg mb-2">Now:</h2>
          <div className="flex items-center">
            <Image src={nowPlaying.album.images[0].url} alt={nowPlaying.name} width={60} height={60} />
            <div className="ml-3">
              <h2 className="text-base font-bold">{nowPlaying.name}</h2>
              <p className="italic text-sm">{nowPlaying.artists.map((artist) => artist.name).join(', ')}</p>
            </div>
          </div>
        </div>
      }
      {queue && queue.length > 0 &&
        <div className="user-queue">
          <h2 className="block font-bold text-lg mb-2">Next:</h2>
          <div className="flex flex-wrap gap-2">
            {queue.map((track, index) => (
              <div className="flex items-center w-full" key={`${track.id}${index}`}>
                <Image src={track.album.images[0].url} alt={track.name} width={60} height={60} />
                <div className="ml-3">
                  <h3 className="text-base font-bold">{track.name}</h3>
                  <p className="italic text-sm">{track.artists.map((artist) => artist.name).join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    </>
  )
}