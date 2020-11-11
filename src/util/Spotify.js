const clientId = '666e7640c2994bf0903c1bf5a67693e8';
const redirectURI = 'http://localhost:3000/';
let accessToken;
let expiresIn;
let userId;

export const Spotify = {
  getAccessToken: () => {
    if (accessToken) {
      return;
    } else if (window.location.href.match(/access_token=([^&]*)/)) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },
  getUserId: () => {
    if (!accessToken) {
      Spotify.getAccessToken();
    }
    return fetch('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        return response.json()
      })
      .then((jsonResponse) => {
        userId = jsonResponse.id;
      })
  },
  search: (term) => {
    if (!accessToken) {
      Spotify.getAccessToken();
    }
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((response) => {
        return response.json()
      })
      .then((jsonResponse) => {
        if (jsonResponse.tracks) {
          return jsonResponse.tracks.items.map((track) => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            }
          })
        }
        return []
      })
  },
  savePlaylist: async (name, tracks) => {
    if (!accessToken) {
      Spotify.getAccessToken();
    }
    if (name && tracks) {
      await Spotify.getUserId();
      const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name })
      });
      const playlist = await response.json();
      fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ uris: tracks })
      })
    } else {
      return;
    }
  }
}