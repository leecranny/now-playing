import React, { useEffect } from "react";
import { Box, Text, Stack } from "@chakra-ui/react";
import Marquee from "react-fast-marquee"; 
import "./rockbox/rockbox.css"
import "./listening.css";

const NoResults = () => {
  useEffect(() => {
    document.title = '(Lee is offline)'; // Set the page title when the component mounts

    return () => {
      document.title = 'Lee is listening...'; // Set the default title when the component unmounts
    };
  }, []);

  return (
    <Box
      position="absolute"
      bottom="0" 
      left="0"
      width="100%" 
      className="song-title"
      style={{ pointerEvents: "none" }}
      >
        <Marquee className="fade-in">
          <Stack direction="row" spacing={1}>
              <Text
                fontFamily="Rockbox"
              >
                Nothing is playing.
              </Text>
            </Stack>
        </Marquee>
      </Box>
  );
};

export default NoResults;


