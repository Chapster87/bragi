interface TopTracks {}

interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
      filter_enabled: boolean,
      filter_locked: boolean
  },
  external_urls: { spotify: string; };
  followers: { href: string; total: number; };
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

interface NowPlaying {
  item: Track;
  progress_ms: number;
  is_playing: boolean;
}

interface Playlist {}

interface Image {
  url: string;
  height: number;
  width: number;
}

interface Track {
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
}

interface Artist {
  name: string;
}

interface Album {
  images: { url: string }[];
}