import { useEffect, useState } from 'react';

import TrackInfo from '@/components/ControlBar/TrackInfo';
import PlaybackControls from '@/components/ControlBar/PlaybackControls';
import TrackTimer from '@/components/ControlBar/TrackTimer';
import ActiveDevice from '@/components/ControlBar/ActiveDevice';

import { ListMusic } from 'lucide-react';

import Spotify from '@/services/spotify'
const spotify = new Spotify();

export default function ControlBar({ playerSDK }) {
  const [devices, setDevices] = useState();

  useEffect(() => {
    if (playerSDK) {
      playerSDK.addListener('ready', () => {
        spotify.fetchAvailableDevices()
          .then(response => {
            setDevices(response.devices);
          });
      });
    } else {
      spotify.fetchAvailableDevices()
        .then(response => {
          setDevices(response.devices);
        });
    }
  }, [playerSDK]);

  let activeDevice = null;

  if (devices?.length > 0) {
    activeDevice = devices?.find((device: Device) => device.is_active === true);
  }

  return (
    <div className="control-bar sticky bottom-0 w-full bg-slate-900 p-3">
      <div className="flex items-center">
        <div className="flex items-center justify-start w-1/3">
          <TrackInfo />
        </div>
        <div className="flex flex-col items-center justify-center w-1/3">
          <PlaybackControls playerSDK={playerSDK} />
          <div className="flex items-center justify-center w-full">
            <TrackTimer />
          </div>
        </div>
        <div className="flex items-center justify-end  w-1/3">
          <button className="btn-queue" type="button" aria-label="Open Queue"><ListMusic /></button>
        </div>
      </div>
      {activeDevice && <ActiveDevice device={activeDevice} />}
    </div>
  )
}