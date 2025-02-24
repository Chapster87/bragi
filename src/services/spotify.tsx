export default class Spotify {
  clientId: string | undefined;
  clientSecret: string | undefined;
  refreshToken: string | undefined;
  params: URLSearchParams;
  code: string | null;
  redirectUri: string;
  scope: string;

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
    this.refreshToken = process.env.NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN;
    this.params = new URLSearchParams(window.location.search);
    this.code = this.params.get("code");
    this.redirectUri = "http://localhost:3000/";
    this.scope = 'user-read-private user-read-email user-top-read user-read-currently-playing user-read-recently-played user-read-playback-state user-modify-playback-state'
  }

  async auth() {
    if (!this.code) {
      this.redirectToAuthCodeFlow();
    } else {
      const { access_token } = await this.getAccessToken();

      if (access_token) {
        localStorage.setItem('access_token', access_token);
      }
    }
  }

  async redirectToAuthCodeFlow() {
    const verifier = this.generateCodeVerifier(128);
    const codeChallenge = await this.generateCodeChallenge(verifier);
    const scope = this.scope;
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    localStorage.setItem("code_verifier", verifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId || '',
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: this.redirectUri,
    });

    authUrl.search = params.toString();
    window.location.href = authUrl.toString();
  }

  generateCodeVerifier(length: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  }

  async getAccessToken() {
    const basic = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')
    const refresh_token = this.refreshToken;

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refresh_token || '',
        }).toString(),
    });

    return response.json();
  };

  async fetchProfile(): Promise<UserProfile> {
    const accessToken = localStorage.getItem('access_token');

    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    return await result.json();
  }

  async fetchTopTracks(): Promise<TopTracks> {
    const accessToken = localStorage.getItem('access_token');

    const result = await fetch("https://api.spotify.com/v1/me/top/tracks", {
      method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
  
    return await result.json();
  }

  async fetchNowPlaying(): Promise<Track> {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status > 400) {
      throw new Error('Unable to Fetch Song');
      return null;
    } else if(response.status === 204) { //The response was fetched but there was no content
      return null;
    }
  
    return await response.json();
  }

  async fetchUserQueue(): Promise<Track> {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch("https://api.spotify.com/v1/me/player/queue", {
      method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status > 400) {
      throw new Error('Unable to Fetch Queue');
      return null;
    }
  
    return await response.json();
  }

  async fetchUserHistory(): Promise<Track> {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
      method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status > 400) {
      throw new Error('Unable to Fetch Queue');
      return null;
    }
  
    return await response.json();
  }

  async play() {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT", headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status > 400) {
      throw new Error('Unable to resume/play');
    }
  }

  async playSpecificTrack(trackUri: string) {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT", 
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ uris: [trackUri] })
    });

    if (response.status > 400) {
      throw new Error('Unable to resume/play selected track');
    }
  }

  async pause() {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
      method: "PUT", headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status > 400) {
      throw new Error('Unable to pause playback');
    }
  }

  async skipPrev() {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch("https://api.spotify.com/v1/me/player/previous", {
      method: "POST", headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status > 400) {
      throw new Error('Unable to skip to previous');
    }
  }

  async skipNext() {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST", headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.status > 400) {
      throw new Error('Unable to skip to next');
    }
  }
}