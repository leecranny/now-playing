import React, { useEffect, useState } from "react";
import { Box, Stack, Text, Link, Spinner, Image } from "@chakra-ui/react";
import getNowPlayingItem from "./SpotifyAPI";
import NoResults from "./NoResults";
import Marquee from "react-fast-marquee";
import NoiseBox from "./NoiseBox";
import "./listening.css";
import "./rockbox/rockbox.css";

const SpotifyNowPlaying = (props) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  const handleLinkHover = () => {
    setIsLinkHovered(true);
  };

  const handleLinkHoverExit = () => {
    setIsLinkHovered(false);
  };

  useEffect(() => {
    const fetchData = () => {
      Promise.all([
        getNowPlayingItem(
        ),
      ]).then((results) => {
        console.log(results);
        setResult(results[0]);
        setLoading(false);
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [props.client_id, props.client_secret, props.refresh_token]);

  // Changing the page title
  useEffect(() => {
    document.title = "Lee is listening..."; // Title when the component mounts

    return () => {
      document.title = "Lee is listening..."; // Title when the component unmounts
    };
  }, []);

  let currentImage = result.isPlaying
  ? result.albumImageUrl
  : "https://freight.cargo.site/t/original/i/9813de878b99b6e38d77d3d8a012bb377d87cd6a05ef856aa65244c23f624a59/test-18.jpg";

  return (
    <Box>
      <NoiseBox currentImage={currentImage} currentImageWidth={result.isPlaying ? result.albumImageWidth : 1943} currentImageHeight={result.isPlaying ? result.albumImageHeight : 1457} />
      {loading ? (
        <Stack align="center" mb={8}>
          <Spinner size="md" speed="0.6s" thickness={3} color="gray.500" />
        </Stack>
      ) : (
        <>
          {result.isPlaying ? (
            <Stack
              width="full"
              mb={result.isPlaying ? 2 : 4}
              spacing={0}
            >
              <Box position="fixed" top="0" right="0" m={4}>
                <Link
                  href={"https://open.spotify.com/user/1248522628"}
                  target="_blank"
                >
                  <Image
                    src="https://freight.cargo.site/t/original/i/9917d07595759ce1c32038db6ef698b7c4150b1d7c9bafe208de9988505d5de7/for-spinner.jpg"
                    boxSize="75px"
                    className="avatar"
                  />
                </Link>
              </Box>
              <Link href={result.songUrl} 
                target="_blank" 
                className={`song-title ${isLinkHovered ? "hovered" : ""}`}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkHoverExit}
              >
                <Stack
                  direction="row"
                  spacing={4}
                  position="absolute"
                  bottom="0"
                  left="0"
                  width="100%"
                  className="fade-in"
                >
                  <Marquee className="marquee-text">
                    <Stack direction="row" spacing='20px'>
                      <Text color="white" fontFamily="Rockbox">
                        {result.title}
                      </Text>
                      <Text color="white" fontFamily="Rockbox">
                        -
                      </Text>
                      <Text color="white" fontFamily="Rockbox">
                        {result.artist}
                      </Text>
                    </Stack>
                  </Marquee>
                </Stack>
              </Link>
            </Stack>
          ) : (
            <NoResults />
          )}
        </>
      )}
    </Box>
  );
};

export default SpotifyNowPlaying;
