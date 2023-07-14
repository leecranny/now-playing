import { ChakraProvider } from '@chakra-ui/react';
import SpotifyNowPlaying from './spotify/SpotifyNowPlaying';

const App = () => {
  return (
    <ChakraProvider>
      <SpotifyNowPlaying />
    </ChakraProvider>
  );
}

export default App;
