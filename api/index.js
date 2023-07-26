import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';
import 'log-timestamp';
import express from 'express';
import { Buffer } from 'buffer';
dotenv.config();
const app = express();
const port = 7001;

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const getAccessToken = async () => {

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refresh_token);

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString()
  });

  return response.json();

};

const getNowPlaying = async (client_id, client_secret, refresh_token) => {

    const { access_token } = await getAccessToken(
        client_id,
        client_secret,
        refresh_token
    );

    const nowPlayingResponse = fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
        Authorization: `Bearer ${access_token}`,
        },
    });

  console.log(nowPlayingResponse);

  return nowPlayingResponse;
};

async function getNowPlayingItem(
  client_id,
  client_secret,
  refresh_token
) {
  const response = await getNowPlaying(client_id, client_secret, refresh_token);
  if (response.status === 204 || response.status > 400) {
    return false;
  }

  const song = await response.json();
  const albumImageUrl = song.item.album.images[0].url;
  const albumImageWidth = song.item.album.images[0].width;
  const albumImageHeight = song.item.album.images[0].height;
  const artist = song.item.artists.map((_artist) => _artist.name).join(", ");
  const isPlaying = song.is_playing;
  const songUrl = song.item.external_urls.spotify;
  const title = song.item.name;

  return {
    albumImageUrl,
    albumImageWidth,
    albumImageHeight,
    artist,
    isPlaying,
    songUrl,
    title,
  };
}

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://headwaves.dev.bitprism.co', 'https://headwav.es'],
};
  
app.use(cors(corsOptions));

app.get('/currentlyPlaying', async (req, res) => {
    console.log(client_id, client_secret, refresh_token);
  const response = await getNowPlayingItem(client_id, client_secret, refresh_token)
  res.json(response);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});