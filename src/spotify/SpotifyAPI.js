
const NOW_PLAYING_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export default async function getNowPlayingItem(
) {
  const response = await fetch(NOW_PLAYING_ENDPOINT);
  return response.json();
}
