'use client';
import Player from '~/components/streaming/Player';

const Stream = () => {
  return (
    <div>
      <Player src='https://streaming-shimesaba-jpea.streaming.media.azure.net/9462ac8e-52ac-4226-921c-c1cbe20fc8d7/output-20230520-200725-manifest.ism/manifest(format=m3u8-cmaf)' />
    </div>
  );
};

export default Stream;
