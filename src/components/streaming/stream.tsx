import Hls from 'hls.js';

const Stream = () => {
  const video = document.querySelector('#video');
  const videoSrc = 'video/master.m3u8';

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // ネイティブサポートブラウザ用
    video.src = videoSrc;
  }
};
