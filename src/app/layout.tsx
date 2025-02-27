import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import BreakpointIndicator from "@/components/BreakpointIndicator";
import "@/styles/app.css";

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: "Bragi | A Spotify Experiment with Next.js",
  description: "A Spotify Experiment with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased`}
      >
        <BreakpointIndicator />
        {children}
      </body>
    </html>
  );
}
