import { useEffect, useState } from 'react';
import Image from 'next/image'

import Spotify from '@/services/spotify'

export default function UserHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const spotify = new Spotify();
    const getHistory = async () => {
    spotify.fetchUserHistory()
      .then(response => {
        setHistory(response);
      });
    };

    let updateHistory = setInterval(() => {
      getHistory();

      // if (queue === null) {
      //   clearInterval(updateHistory);
      // }
    }, 1000);

  }, []);

  return (
    <>
      {history && history.items && history.items.length > 0 &&
        <div className="user-history">
          <h2 className="block font-bold text-lg mb-2">Recently Played:</h2>
          <div className="flex flex-wrap gap-2">
            {history.items.map((item, index) => {
              const track = item.track;
              return (
                <div className="flex items-center w-full" key={`${track.id}${index}`}>
                  <Image src={track.album.images[0].url} alt={track.name} width={60} height={60} />
                  <div className="ml-3">
                    <h3 className="text-base font-bold">{track.name}</h3>
                    <p className="italic text-sm">{track.artists.map((artist) => artist.name).join(', ')}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      }
    </>
  )
}