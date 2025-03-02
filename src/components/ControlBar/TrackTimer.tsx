import { useEffect, useState } from 'react';

import Spotify from '@/services/spotify'
const spotify = new Spotify();

export default function TrackTimer() {
  const [timer, setTimer] = useState({
    minutesPlayed: 0,
    secondsPlayed: 0,
    minutesTotal: 0,
    secondsTotal: 0,
    timePlayedSeconds: 0,
    timeTotalSeconds: 0
  });

  useEffect(() => {
      const getNowPlaying = async () => {
        spotify.fetchNowPlaying()
          .then(response => {
            setTimer({
              ...timer,
              timePlayedSeconds: Math.floor(response.progress_ms/1000),
              timeTotalSeconds: Math.floor((response.item.duration_ms || 0) / 1000),
              secondsPlayed: Math.floor(response.progress_ms/1000)%60,
              minutesPlayed: Math.floor(Math.floor(response.progress_ms/1000)/60),
              secondsTotal: Math.floor((response.item.duration_ms || 0) / 1000)%60,
              minutesTotal: Math.floor(Math.floor((response.item.duration_ms || 0) / 1000)/60)
            })
          })
      };

      let updateNowPlaying = setInterval(() => {
        getNowPlaying();
      }, 1000);
  }, []);

  // Used to set 0 as padding when the it is a single digit number
  const pad = (n) =>{
    return (n < 10) ? ("0" + n) : n;
  }

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = Number(event.target.value) * 1000;
    spotify.seekToPosition(seekTo);
  }

  const seekBeforeWidth = { "--seek-before-width": `${timer.timePlayedSeconds / timer.timeTotalSeconds * 100}%` } as React.CSSProperties;

  return (
    <div className="track-timer w-full flex items-center">
      <div className="current-time text-sm mr-2">{pad(timer.minutesPlayed)}:{pad(timer.secondsPlayed)}</div>
      <div className="scrobbler w-full flex items-center" style={seekBeforeWidth}><input type="range" className="w-full" id="seek-slider" max={timer.timeTotalSeconds} value={timer.timePlayedSeconds} onChange={handleSliderChange} /></div>
      <div className="total-time text-sm ml-2">{pad(timer.minutesTotal)}:{pad(timer.secondsTotal)}</div>
    </div>
  )
}