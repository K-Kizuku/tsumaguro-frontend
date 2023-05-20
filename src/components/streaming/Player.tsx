import React, { useEffect, useMemo, useRef } from 'react';
import Hls from 'hls.js';
// import NextHead from "next/head"
import { FC } from 'react';

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
      <div className='content'>
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
          width: 100%;
          height: auto;
          vertical-align: top;
        }
      `}</style>
    </>
  );
};

export default Player;
