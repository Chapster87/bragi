import { useEffect, useState } from 'react';
import Image from 'next/image'

import { ListMusic, Pause, Play, SkipBack, SkipForward } from 'lucide-react';

import albumPlaceholder from '@/assets/images/album_placeholder.png';

import Spotify from '@/services/spotify'
const spotify = new Spotify();

export default function ControlBar() {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  useEffect(() => {
    const getNowPlaying = async () => {
      spotify.fetchNowPlaying()
        .then(response => {
          setNowPlaying(response);
        });
    };

    let updateNowPlaying = setInterval(() => {
      getNowPlaying();

      // if (nowPlaying === null) {
      //   clearInterval(updateNowPlaying);
      // }
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
  const timePlayed = progress_ms;
  const timeTotal = item && item.duration_ms;

  if (nowPlaying != null && item && item.name) {
    if (is_playing) {
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
  } else if (nowPlaying === null) {
    playerState = 'OFFLINE';
    title = 'User is currently offline';
    artist = '';
  } else { // If the response wasn't able to fetch anything then we display this
    title = ''
    artist = '';
  }

  //Used to set 0 as padding when the it is a single digit number
  const pad = (n) =>{
    return (n < 10) ? ("0" + n) : n;
  }

  function playTrack() {
    spotify.play();
  }

  function pauseTrack() {
    spotify.pause();
  }

  function prevTrack() {
    spotify.skipPrev();
  }

  function nextTrack() {
    spotify.skipNext();
  }

  return (
    <>
      {nowPlaying &&
        <div className="control-bar sticky bottom-0 w-full bg-slate-900 p-3">
          <div className="flex items-center">
            <div className="flex items-center justify-start w-1/3">
              <figure className='flex items-center'>
                <Image className="rounded" src={albumImageUrl ? albumImageUrl : albumPlaceholder} alt={title} width={80} height={80} />
                <figcaption className="flex items-center ml-4">
                  <div className="album-left">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="italic text-base">{artist}</p>
                  </div>
                </figcaption>
              </figure>
            </div>
            <div className="flex flex-col items-center justify-center w-1/3">
              <div className="flex items-center justify-center mb-3">
                <button className="btn-prev cursor-pointer" type="button" onClick={() => prevTrack()} aria-label="Skip to Previous Track"><SkipBack /></button>
                {playerState === 'PAUSE' && <button className="btn-play cursor-pointer" type="button" onClick={() => playTrack()} aria-label="Play Track"><Play /></button>}
                {playerState === 'PLAY' && <button className="btn-pause cursor-pointer" type="button" onClick={() => pauseTrack()} aria-label="Pause Track"><Pause /></button>}
                <button className="btn-next cursor-pointer" type="button" onClick={() => nextTrack()} aria-label="Skip to Next Track"><SkipForward /></button>
              </div>
              <div className="flex items-center justify-center">
                <div className="nowPlayingTime">{pad(minutesPlayed)}:{pad(secondsPlayed)} / {pad(minutesTotal)}:{pad(secondsTotal)}</div>
              </div>
            </div>
            <div className="flex items-center justify-end  w-1/3">
              <button className="btn-queue cursor-pointer" type="button" aria-label="Open Queue"><ListMusic /></button>
            </div>
          </div>
        </div>
      }
    </>
  )
}