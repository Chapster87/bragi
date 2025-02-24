import { Play } from 'lucide-react';
import Image from 'next/image'

import Spotify from '@/services/spotify'

const spotify = new Spotify();

export default function Track({ track }) {

  function playTrack(uri: string) {
    spotify.playSpecificTrack(uri);
  }

  return (
    <button className=" flex items-center w-full group" type="button" onClick={() => playTrack(track.uri)} aria-label="Play Track" key={track.id}>
      <figure className="flex items-center justify-start">
        <div className="relative rounded overflow-hidden">
          <Image src={track.album.images[0].url} alt={track.name} width={60} height={60} />
          <div className="play-overlay absolute top-0 w-full h-full hidden group-hover:flex bg-black/70 items-center justify-center z-10">
            <Play className="text-white" />
          </div>
        </div>
        <figcaption className="ml-3 text-left">
          <h3 className="text-base font-bold group-hover:text-green">{track.name}</h3>
          <p className="italic text-sm">{track.artists.map((artist) => artist.name).join(', ')}</p>
        </figcaption>
      </figure>
    </button>  
  )
}