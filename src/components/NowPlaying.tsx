import { useEffect, useState } from 'react';
import Image from 'next/image'

import Spotify from '@/services/spotify'

import albumPlaceholder from '@/assets/images/album_placeholder.png';

export default function TopTracks() {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  useEffect(() => {
    const spotify = new Spotify();
    const getNowPlaying = async () => {
      spotify.fetchNowPlaying()
        .then(response => {
          setNowPlaying(response);
          console.log('nowPlaying', response);
        });
      };

    setInterval(() => {
      getNowPlaying();
    }, 1000);
    
  }, []);

  let playerState = ''
  let secondsPlayed = 0;
  let minutesPlayed = 0;
  let secondsTotal = 0;
  let minutesTotal = 0;
  const { item, progress_ms, is_playing } = nowPlaying || { item: { name: '', artists: [], album: { images: [{ url: '' }] } }, progress_ms: 0, is_playing: false };
  const  albumImageUrl = (item && item.album && item.album.images.length > 0) && item.album.images[0].url;
  let title = item && item.name;
  let artist = item && item.artists.map((artist) => artist.name).join(', ');
  const isPlaying = is_playing;
  const timePlayed = progress_ms;
  const timeTotal = item && item.duration_ms;

  if (nowPlaying != null && item && item.name) {

    if (isPlaying) {
      playerState = 'PLAY';
    } else {
      playerState = 'PAUSE';
    }

    // Converting the playback duration from seconds to minutes and seconds
    secondsPlayed = Math.floor(timePlayed/1000);
    minutesPlayed = Math.floor(secondsPlayed/60);
    secondsPlayed = secondsPlayed % 60;
  
    // Converting the song duration from seconds to minutes and seconds
    secondsTotal = Math.floor((timeTotal || 0) / 1000);
    minutesTotal = Math.floor(secondsTotal/60);
    secondsTotal = secondsTotal % 60;
  } else if (nowPlaying === null) { //If the response returns null then we print the following text in the widget
    playerState = 'OFFLINE';
    title = 'User is currently offline';
    artist = '';
  } else { //If the response wasn't able to fetch anything then we display this
    title = 'Failed to fetch track data'
    artist = '';
  }

  //Used to set 0 as padding when the it is a single digit number
  const pad = (n) =>{
    return (n < 10) ? ("0" + n) : n;
  }

  return (
    <>
      {nowPlaying &&
        <>
          <h2 className="block font-bold text-lg mb-4">Currently Playing:</h2>
          <figure>
            <Image src={albumImageUrl ? albumImageUrl : albumPlaceholder} alt={title} width={450} height={450} />
            <figcaption className="flex justify-between mt-2">
              <div className="album-left">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="italic text-base">{artist}</p>
              </div>
              <div className="album-right">
                <div className='nowPlayingTime'>{pad(minutesPlayed)}:{pad(secondsPlayed)} / {pad(minutesTotal)}:{pad(secondsTotal)}</div>
              </div>
            </figcaption>
          </figure>
        </>
      }
    </>
  )
}