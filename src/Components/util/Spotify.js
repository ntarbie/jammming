const clientID = '541dfe682c7a4f3f98460630a2a8185f';
const redirectURI = 'http://n8jammming.surge.sh';
const spotifyUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

let accessToken = undefined;
let expiresIn = undefined;

  const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenUrl = window.location.href.match(/access_token=([^&]*)/);
    const expiresInUrl = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenUrl && expiresInUrl) {
      accessToken = accessTokenUrl[1];
      expiresIn = expiresInUrl[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = spotifyUrl;
    }
  },

  search(term) {
    const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term}`
    return fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Request failed!');
  }, networkError => console.log(networkError.message)
).then(jsonResponse => {
  if (jsonResponse.tracks) {
    return jsonResponse.tracks.items.map(track => {
      return {
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri
      }
    })
  }
});
},

  savePlaylist(playlistName, trackURIs) {
    if (playlistName && trackURIs) {
      const headers = {
        Authorization: `Bearer ${accessToken}`
      }
      let userID = undefined;
      let playlistID = undefined;
        fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
      )
      .then(jsonResponse => {
        if (jsonResponse.id) {
          userID = jsonResponse.id;
          return userID;
        }
      })
      .then(() => {
        const createPlaylistUrl = `https://api.spotify.com/v1/users/${userID}/playlists`;
        fetch(createPlaylistUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            name: playlistName
          })
        })
      .then(response => {
          return response.json();
        }
      ).then(response => {
        playlistID = response.id;
        return playlistID;
      })
      .then(() => {
        const addPlalystTracksUrl = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
        fetch(addPlalystTracksUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            uris: trackURIs
          })
})
        });
      })

    } else {
      return;
    }
  }
}

export default Spotify;
