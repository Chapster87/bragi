import { access } from "fs";

export default class Spotify {
  clientId: string | undefined;
  params: URLSearchParams;
  code: string | null;
  redirectUri: string;

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    this.params = new URLSearchParams(window.location.search);
    this.code = this.params.get("code");
    this.redirectUri = "http://localhost:3000/";
  }

  async auth() {
    if (!this.code) {
      this.redirectToAuthCodeFlow();
    } else {
      let accessToken = localStorage.getItem('access_token');
      console.log('accessToken', accessToken);

      if (!accessToken || accessToken === 'undefined') {
        accessToken = await this.getAccessToken();
      }
      // else {
      //   accessToken = await this.getRefreshToken();
      // }
    }
  }

  async redirectToAuthCodeFlow() {
    const verifier = this.generateCodeVerifier(128);
    const codeChallenge = await this.generateCodeChallenge(verifier);
    const scope = 'user-read-private user-read-email user-top-read';
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

  async getAccessToken(): Promise<string> {
    console.log('getAccessToken');
    const codeVerifier = localStorage.getItem('code_verifier');
    const url = "https://accounts.spotify.com/api/token";
    
    if (!this.code || !codeVerifier) {
      throw new Error("Authorization code or code verifier is missing");
    }
    
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId || '',
        grant_type: 'authorization_code',
        code: this.code || '',
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier,
      }).toString(),
    }

    const body = await fetch(url, payload);
    const response = await body.json();

    localStorage.setItem('access_token', response.access_token);

    return response.access_token;
  }

  // async getRefreshToken() {
  //   console.log('getRefreshToken');
  //   // refresh token that has been previously stored
  //   const refreshToken = localStorage.getItem('refresh_token');
  //   const url = "https://accounts.spotify.com/api/token";

  //   const payload = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     body: new URLSearchParams({
  //       grant_type: 'refresh_token',
  //       refresh_token: refreshToken || '',
  //       client_id: this.clientId || ''
  //     }),
  //   }
  //   const body = await fetch(url, payload);
  //   const response = await body.json();

  //   localStorage.setItem('access_token', response.accessToken);
  //   if (response.refreshToken) {
  //     localStorage.setItem('refresh_token', response.refreshToken);
  //   }

  //   return response.access_token;
  // }

  async fetchProfile(): Promise<UserProfile> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    return await result.json();
  }

  async fetchTopTracks(): Promise<TopTracks> {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const result = await fetch("https://api.spotify.com/v1/me/top/tracks", {
      method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });
  
    return await result.json();
  }
}