'use client';
import Image from 'next/image';
// import Streaming from '~/components/Stream';

export default function Home() {
  return (
    <div className='containner'>
      <div className='stage'>
        <div className='dice'>
          <div className='item'>1</div>
          <div className='item'>2</div>
          <div className='item'>3</div>
          <div className='item'>4</div>
          <div className='item'>5</div>
          <div className='item'>6</div>
        </div>
      </div>
    </div>
  );
}
