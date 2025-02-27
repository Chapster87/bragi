"use client";

import { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import { Tab, TabsBody, TabsHeader, TabPanel, Tabs } from '@/components/common/Tabs';
import TopTracks from '@/components/TopTracks';
import UserPlaylists from '@/components/UserPlaylists';
import UserQueue from '@/components/UserQueue';
import UserHistory from '@/components/UserHistory';
import ControlBar from '@/components/ControlBar/ControlBar';

import Spotify from '@/services/spotify'
const spotify = new Spotify();

export default function Home() {
  const [player, setPlayer] = useState(undefined);

  useEffect(() => {
    spotify.auth();

    const token = spotify.getToken();
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
          name: 'Web Playback SDK',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5
      });

      setPlayer(player);
    };
  }, []);

  return (
    <>
      <Header />
      <main className="flex py-4 px-3 sm:px-4 gap-2">
        <div className="w-1/5 rounded bg-slate-700 p-3 m-h-full">
          <TopTracks playerSDK={player} />
        </div>
        <div className="w-3/5 p-3">
          <UserPlaylists />
        </div>
        <div className="w-1/5 rounded bg-slate-700 p-3">
          <Tabs>
            <TabsHeader>
              <Tab>Queue</Tab>
              <Tab>History</Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel>
                <UserQueue />
              </TabPanel>
              <TabPanel>
                <UserHistory />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </main>
      {player && <ControlBar playerSDK={player} />}
    </>
  );
}
