import React, { useEffect, useState } from "react";
import { Box, Stack, Text, Link, Spinner, Image, Flex } from "@chakra-ui/react";
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
  const [initialLoad, setInitialLoad] = useState(false);

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
        if (!initialLoad && results[0].isPlaying) {
          setInitialLoad(true);
        }
      });
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [props.client_id, props.client_secret, props.refresh_token, initialLoad]);

  
  useEffect(() => {
    document.title = "Lee is listening..."; // Title when the component mounts

    return () => {
      document.title = "Lee is listening..."; // Title when the component unmounts
    };
  }, []);

  let currentImage = result.isPlaying
  ? result.albumImageUrl
  : "https://freight.cargo.site/t/original/i/17a8cbdea196c816d7409a500ffcdb80fdf75c3551d3d4c9267e0121a03a693d/bkgrnd.jpg";

  return (
    <Box>
      {loading ? (
        <>
        <Flex
          align="center"
          justify="center"
          height="100vh" 
        >
          <Spinner size="xl" speed="0.6s" thickness={3} color="gray.200" />
        </Flex>
        </>
      ) : (
        <>
        <NoiseBox currentImage={currentImage} currentImageWidth={result.isPlaying ? result.albumImageWidth : 1943} currentImageHeight={result.isPlaying ? result.albumImageHeight : 1457} />
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
                  spacing={6}
                  position="absolute"
                  bottom="0"
                  left="0"
                  width="100%"
                  className="fade-in"
                >
                  <Marquee className="marquee-text">
                    <Stack direction="row" spacing='0.25em'>
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
