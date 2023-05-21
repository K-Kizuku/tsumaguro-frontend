'use client';
import Player from '~/components/streaming/Player';

const Stream = ({ searchParams }: { searchParams: { url: string } }) => {
  return (
    <div>
      <Player src={searchParams.url} />
    </div>
  );
};

export default Stream;
