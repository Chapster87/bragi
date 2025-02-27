import { useEffect, useState } from 'react';
import Image from 'next/image'

import albumPlaceholder from '@/assets/images/album_placeholder.png';

import Spotify from '@/services/spotify'
const spotify = new Spotify();

export default function TrackInfo() {
  const [track, setTrack] = useState(
    {
      name: "User is currently offline",
      albumImageUrl: "",
      artist: ""
    }
  );

  useEffect(() => {
      const getNowPlaying = async () => {
        spotify.fetchNowPlaying()
          .then(response => {
            setTrack({
              name: response.item.name,
              albumImageUrl: response.item.album.images[0].url,
              artist: response.item.artists.map((artist) => artist.name).join(', ')
            });
          });
      };

      let updateNowPlaying = setInterval(() => {
        getNowPlaying();
      }, 1000);
  }, []);


  const { name, albumImageUrl, artist } = track;

  return (
    <figure className='flex items-center'>
      <Image className="rounded" src={albumImageUrl ? albumImageUrl : albumPlaceholder} alt={name} width={80} height={80} />
      <figcaption className="flex items-center ml-4">
        <div className="album-left">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="italic text-base">{artist}</p>
        </div>
      </figcaption>
    </figure>
  )
}