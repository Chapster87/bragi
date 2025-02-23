"use client";

import { useEffect } from 'react';
import Header from '@/components/common/Header';
import { Tab, TabsBody, TabsHeader, TabPanel, Tabs } from '@/components/common/Tabs';
import TopTracks from '@/components/TopTracks';
import UserQueue from '@/components/UserQueue';
import ControlBar from '@/components/ControlBar';

import Spotify from '@/services/spotify'


export default function Home() {

  useEffect(() => {
    const spotify = new Spotify();
    spotify.auth();
  }, []);

  return (
    <>
      <Header />
      <main className="flex py-4 px-3 sm:px-4 gap-2">
        <div className="w-1/5 rounded bg-slate-700 p-3 m-h-full">
          <TopTracks />
        </div>
        <div className="w-3/5 p-3">
          
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
                Listen History
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </main>
      <ControlBar />
    </>
  );
}
