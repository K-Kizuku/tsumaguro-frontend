import React, { useEffect, useMemo, useRef } from 'react';
import Hls from 'hls.js';
// import NextHead from "next/head"
import { FC } from 'react';
import { Box, Title } from '@mantine/core';

interface Props {
  src: string;
}

const Player: FC<Props> = ({ src }) => {
  const isSupportBrowser = useMemo(() => Hls.isSupported(), []);
  const videoRef = useRef(null);
  useEffect(() => {
    if (isSupportBrowser) {
      var hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current!);
      return () => {
        hls.removeAllListeners();
        hls.stopLoad();
      };
    }
  }, [src]);
  return (
    <>
      {/* <NextHead>
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
      </NextHead> */}
      <Box sx={{ marginTop: '-10%' }}>
        <div className='content'>
          <Title sx={{ margin: 'auto' }} order={1}>
            配信
          </Title>
          {isSupportBrowser ? (
            <div className='videoContainer'>
              <video ref={videoRef} className='video' controls></video>
            </div>
          ) : (
            <div className='notSupportBrowser'>
              お使いのブラウザでは動画再生をサポートしていません。
            </div>
          )}
        </div>
        <style jsx>{`
          .video {
            width: 80%;
            /* margin-left: 5%; */
            margin: auto;
            /* height: calc(100% - 56px); */
            vertical-align: top;
          }
        `}</style>
      </Box>
    </>
  );
};

export default Player;
