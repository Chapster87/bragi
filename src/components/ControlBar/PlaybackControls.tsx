import { useEffect, useState } from 'react';

import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';

import Spotify from '@/services/spotify'
const spotify = new Spotify();

export default function PlaybackControls({ playerSDK }) {
  const [isSDK, setIsSDK] = useState(true);
  const [player, setPlayer] = useState(playerSDK);
  const [is_paused, setPaused] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);

  useEffect(() => {
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });
  
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    const getNowPlaying = async () => {
      spotify.fetchNowPlaying()
        .then(response => {
          setNowPlaying(response);
        });
    };
  
    player.addListener('player_state_changed', ( state => {
  
      if (!state) {
        return;
      }
  
      console.log('player_state_changed', state);
  
      setPaused(state.paused);

      getNowPlaying();
  
      player.getCurrentState().then( state => { 
        if (!state) {
          setIsSDK(false);
        } else {
          setIsSDK(true);
        }
      });
  
    }));
  
    player.getCurrentState().then(state => {
      if (!state) {
        console.warn('User is not playing music through the Web Playback SDK');
        setIsSDK(false);
        return;
      }
  
      var current_track = state.track_window.current_track;
      var next_track = state.track_window.next_tracks[0];
  
      console.log('Currently Playing', current_track);
      console.log('Playing Next', next_track);
    });
  
    player.connect().then(success => {
      if (success) {
        console.log('The Web Playback SDK successfully connected to Spotify!');
      }
    })

    if (!isSDK) {
      let updateNowPlaying = setInterval(() => {
        getNowPlaying();
      }, 1000);
    }
  }, [isSDK, player]);

  let playerState = ''
  const { item, is_playing } = nowPlaying || { progress_ms: 0, is_playing: false };

  if (nowPlaying != null && item && item.name) {
    if (is_playing) {
      playerState = 'PLAY';
    } else {
      playerState = 'PAUSE';
    }
  } else if (nowPlaying === null) {
    playerState = 'OFFLINE';
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
    <div>
      <div className="flex items-center justify-center mb-3">
        <button className="btn-prev" type="button" onClick={() => prevTrack()} aria-label="Skip to Previous Track"><SkipBack /></button>
        {playerState === 'PAUSE' && <button className="btn-play" type="button" onClick={() => playTrack()} aria-label="Play Track"><Play /></button>}
        {playerState === 'PLAY' && <button className="btn-pause" type="button" onClick={() => pauseTrack()} aria-label="Pause Track"><Pause /></button>}
        <button className="btn-next" type="button" onClick={() => nextTrack()} aria-label="Skip to Next Track"><SkipForward /></button>
      </div>
    </div>
  )
}