import { useEffect, useState } from 'react';

import { Play } from 'lucide-react';
import Image from 'next/image'

import Spotify from '@/services/spotify'

const spotify = new Spotify();

export default function UserPlaylists() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    // spotify.fetchUserPlaylists()
    //   .then(response => {
    //     console.log(response);
    //     setPlaylists(response);
    //   });
  }, []);

  return (
    <>
      {playlists && playlists.items && playlists.items.length > 0 &&
        <>
          <h1 className="mb-2">User Playlists:</h1>
          <div className="flex flex-wrap gap-2">
            {playlists.items.map((list) => (
              <figure key={list.id}>
                <Image src={list.images[0].url} alt={list.name} width={120} height={120} />
                <figcaption>{list.name}</figcaption>
              </figure>
            ))}
          </div>
        </>
      }
    </>  
  )
}