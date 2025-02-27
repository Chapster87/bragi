import { useEffect, useState } from 'react';

import Spotify from '@/services/spotify'
const spotify = new Spotify();

export default function TrackTimer() {
  const [timer, setTimer] = useState({
    minutesPlayed: 0,
    secondsPlayed: 0,
    minutesTotal: 0,
    secondsTotal: 0,
    timePlayed: 0,
    timeTotal: 0
  });

  useEffect(() => {
      const getNowPlaying = async () => {
        spotify.fetchNowPlaying()
          .then(response => {
            setTimer({
              ...timer,
              timePlayed: response.progress_ms,
              timeTotal: response.item.duration_ms,
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

  return (
    <div className="nowPlayingTime">{pad(timer.minutesPlayed)}:{pad(timer.secondsPlayed)} / {pad(timer.minutesTotal)}:{pad(timer.secondsTotal)}</div>
  )
}