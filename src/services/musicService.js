const axios = require('axios');
let spotifyToken = null;

async function getSpotifyToken() {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      new URLSearchParams({
        'grant_type': 'client_credentials'
      }).toString(),
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    spotifyToken = response.data.access_token;
    return spotifyToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error.message);
    throw error;
  }
}

async function getMusicDetails(songTypes) {
  try {
    if (!spotifyToken) {
      await getSpotifyToken();
    }

    const songs = [];
    
    for (const songType of songTypes) {
      try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
          headers: {
            'Authorization': `Bearer ${spotifyToken}`
          },
          params: {
            q: songType,
            type: 'track',
            market: 'US',
            limit: 1
          }
        });

        if (response.data.tracks.items.length > 0) {
          const track = response.data.tracks.items[0];
          
          songs.push({
            id: track.id,
            title: track.name,
            artist: track.artists.map(artist => artist.name).join(', '),
            album: track.album.name,
            releaseDate: track.album.release_date,
            duration: track.duration_ms,
            previewUrl: track.preview_url,
            spotifyUrl: track.external_urls.spotify,
            albumArt: track.album.images[0]?.url || null,
            popularity: track.popularity
          });
        }
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expired, get new token and retry
          spotifyToken = null;
          await getSpotifyToken();
          return getMusicDetails(songTypes);
        }
        throw error;
      }
    }

    if (songs.length === 0) {
      throw new Error('No songs found for the recommended types');
    }

    return songs;
  } catch (error) {
    console.error('Error fetching music details:', error.message);
    throw error;
  }
}

module.exports = {
  getMusicDetails
}; 