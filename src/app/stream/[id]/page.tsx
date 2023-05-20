'use client';
import Player from '~/components/streaming/Player';

const Stream = () => {
  return (
    <div>
      <Player src='https://shimesaba-jpea.streaming.media.azure.net/d51ba1ed-8333-4386-b328-176ee2c84fe5/output.ism/manifest(format=m3u8-cmaf)' />
    </div>
  );
};

export default Stream;
