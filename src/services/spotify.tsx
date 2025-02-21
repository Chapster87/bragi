export default class Spotify {
  clientId: string | undefined;
  clientSecret: string | undefined;
  refreshToken: string | undefined;
  params: URLSearchParams;
  code: string | null;
  redirectUri: string;

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
    this.refreshToken = process.env.NEXT_PUBLIC_SPOTIFY_REFRESH_TOKEN;
    this.params = new URLSearchParams(window.location.search);
    this.code = this.params.get("code");
    this.redirectUri = "http://localhost:3000/";
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
    const scope = 'user-read-private user-read-email user-top-read user-read-currently-playing user-read-recently-played user-read-playback-state';
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
    try {
      const accessToken = localStorage.getItem('access_token');

      const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
      });

      return await result.json();
    } catch (error) {
      console.error('Error fetching profile: ', error);
      return error.message.toString();
    }
  }

  async fetchTopTracks(): Promise<TopTracks> {
    try {
      const accessToken = localStorage.getItem('access_token');

      const result = await fetch("https://api.spotify.com/v1/me/top/tracks", {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
      });
    
      return await result.json();
    } catch (error) {
      console.error('Error fetching top tracks: ', error);
      return error.message.toString();
    }
  }

  async fetchNowPlaying(): Promise<Track> {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (response.status > 400) {
        throw new Error('Unable to Fetch Song');
      } else if(response.status === 204) { //The response was fetched but there was no content
        throw new Error('Currently Not Playing')
      }
    
      return await response.json();
    } catch (error) {
      console.error('Error fetching now playing: ', error);
      return error.message.toString();
    }
  }
}