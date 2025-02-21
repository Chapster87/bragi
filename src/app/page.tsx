"use client";

import { useEffect } from 'react';
import Header from '@/components/common/Header';
import TopTracks from '@/components/TopTracks';
import NowPlaying from '@/components/NowPlaying';

import Image from "next/image";
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
        <div className="w-1/5 rounded bg-slate-700 p-3">
          <TopTracks />
        </div>
        <div className="w-3/5 p-3">
          
        </div>
        <div className="w-1/5 rounded bg-slate-700 p-3">
          <NowPlaying />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>

    </>
  );
}
