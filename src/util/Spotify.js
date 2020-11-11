const clientId = '666e7640c2994bf0903c1bf5a67693e8';
const redirectURI = 'http://localhost:3000/';
let accessToken;
let expiresIn;

export const Spotify = {
  getAccessToken: () => {
    if (accessToken) {
      return accessToken
    } else if (window.location.href.match(/access_token=([^&]*)/).length > 0) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  }
}