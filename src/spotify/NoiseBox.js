///Backup NoiseBox

import { React, useEffect, useState } from 'react';
import { Shaders, Node, GLSL } from 'gl-react';
import { Surface  } from 'gl-react-dom';
import styled from 'styled-components';

const NoiseBoxWrapper = styled.div`
  min-height: 100vh;

  > span {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`;

const NoiseBoxContainer = styled.div`

`;

const NoiseBox = ({ currentImage, currentImageWidth, currentImageHeight, children }) => {

  const shaders = Shaders.create({
    myShader: {
      frag: GLSL`
        precision mediump float;
        varying vec2 uv;
        uniform sampler2D iChannel0;
        uniform vec3 iChannel0Size;
        uniform float devicePixelRatio;
        uniform float ditherAmount;
        uniform bool Animated;
        uniform bool Monochrome;
        uniform vec3 iResolution;
        uniform float iGlobalTime;
  
        /**
        * trying out couple of dithering methods to get rid of quantization artefactscreenSize.
        * http://www.loopit.dk/banding_in_gamescreenSize.pdf
        */
  
        // Based on "Dithering Methods" by kuvkar: https://www.shadertoy.com/view/ld3XWl
  
        // standard "rand" function 
        float rand(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }
  
        ///////////////////////// dithering functions from ////////////////
        // https://www.shadertoy.com/view/MslGR8# by hornet           /////
        ///////////////////////////////////////////////////////////////////
  
        #define MOD3 vec3(443.8975,397.2973, 491.1871)
        float hash12(vec2 p)
        {
            vec3 p3 = fract(vec3(p.xyx) * MOD3);
            p3 += dot(p3, p3.yzx + 19.19);
            return fract((p3.x + p3.y) * p3.z);
        }

        vec2 calculateUV(vec2 uv) {
          vec2 aspectRatio = vec2(iResolution.x / iResolution.y, 1.0);
          vec2 scaledUV = uv * aspectRatio;
          
          // Adjust UV to maintain aspect ratio and cover the geometry
          vec2 offset = vec2(0.0, 0.0);
          if (scaledUV.x > 2.1) {
            offset.x = (scaledUV.x - 0.5) / 2.0;
          } else {
            offset.y = (scaledUV.y - 0.5) / 2.0;
          }
          
          return fract((scaledUV - offset) / aspectRatio);
        }
  
        void mainImage(out vec4 fragColor, in vec2 fragCoord)
        {
          
            vec2 screenSize = iResolution.xy;
            vec2 imageSize = iChannel0Size.xy;
            float screenRatio = screenSize.x / screenSize.y;
            float imageRatio = imageSize.x / imageSize.y;
            vec2 transformedUv = screenRatio < imageRatio ? vec2(imageSize.x * screenSize.y / imageSize.y, screenSize.y) : vec2(screenSize.x, imageSize.y * screenSize.x / imageSize.x);
            vec2 uvOffset = (screenRatio < imageRatio ? vec2((transformedUv.x - screenSize.x) / 2.0, 0.0) : vec2(0.0, (transformedUv.y - screenSize.y) / 2.0)) / transformedUv;    
            vec2 uv = ( fragCoord / devicePixelRatio ) / transformedUv + uvOffset;
            //vec2 adjustedUV = calculateUV(uv);

            vec4 col = texture2D(iChannel0, uv);
            vec2 seed = uv;
  
            vec4 ditherCol;
            if (Animated) seed += fract(iGlobalTime);
  
            ditherCol.r = (hash12(seed) + hash12(seed + 0.59374) - 1.);
            seed += 0.1;
            ditherCol.g = (hash12(seed) + hash12(seed + 0.59374) - 1.);
            seed += 0.04;
            ditherCol.b = (hash12(seed) + hash12(seed + 0.59374) - 1.);
  
            if (Monochrome)
            {
                ditherCol.g = ditherCol.r;
                ditherCol.b = ditherCol.r;
            }
  
            col += ditherCol * ditherAmount;
  
            fragColor = col;
        }
  
        void main(void)
        {
            mainImage(gl_FragColor, gl_FragCoord.xy);
        }
      `,
    },
  });
  

  const [time, setTime] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();

    const updateGlobalTime = () => {
      const currentTime = Date.now() - startTime;
      setTime(currentTime);
    };

    const intervalId = setInterval(updateGlobalTime, 16); // Update time every 16ms (approx. 60fps)

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    return windowSize;
  };

  const { width, height } = useWindowSize(); // Custom hook to get window size

  return (
    <NoiseBoxWrapper>
      {currentImage &&
      <>
      <Surface width={width} height={height}>
        <Node shader={shaders.myShader} 
        uniforms={{
            iChannel0: currentImage, //'https://imagescreenSize.unsplash.com/photo-1580827760877-1263265d5706?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
            iChannel0Size: [currentImageWidth, currentImageHeight, 1],
            devicePixelRatio: window.devicePixelRatio,
            ditherAmount: 0.3,
            Animated: true,
            Monochrome: true,
            iResolution: [width, height, 1],
            iGlobalTime:  time / 1000,
        }}>

        </Node>
      </Surface>
      </>
      }
      <NoiseBoxContainer>
      {children}
      </NoiseBoxContainer>
    </NoiseBoxWrapper>
  );
}



export default NoiseBox;

