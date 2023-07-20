
const NOW_PLAYING_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export default async function getNowPlayingItem(
) {
  return fetch(NOW_PLAYING_ENDPOINT);
}
