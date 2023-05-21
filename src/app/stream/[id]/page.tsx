'use client';
import Player from '~/components/streaming/Player';
import { Box, Button, ScrollArea, TextInput, Title } from '@mantine/core';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Chatbox from '~/components/atom/Chatbox';
import type { MsgFromClient, MsgFromServer } from '~/types/stream';

const Stream = ({
  searchParams,
  params
}: {
  searchParams: { url: string };
  params: { id: string };
}) => {
  // テスト用, 形式は不問, 一意でさえあればOK
  const streamId = params.id;

  const socketRef = useRef<WebSocket>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const [sentMessage, setSentMessage] = useState<MsgFromServer>({
    comments: [],
    reaction: 0
  });
  const [message, setMassage] = useState<string>('');
  useLayoutEffect(() => {
    scrollBottomRef?.current?.scrollIntoView();
  }, [sentMessage]);

  const sendComment = (e: any) => {
    // e.preventDefault();
    // if (e.target.value == '') return;

    const msg: MsgFromClient = {
      stream_id: streamId,
      comment: message,
      reaction: false,
      is_connected: true
    };
    socketRef.current?.send(JSON.stringify(msg));
    setMassage('');
  };

  const sendReaction = (e: any) => {
    e.preventDefault();
    const msg: MsgFromClient = {
      stream_id: streamId,
      comment: '',
      reaction: true,
      is_connected: true
    };
    socketRef.current?.send(JSON.stringify(msg));
  };

  useEffect(() => {
    socketRef.current = new WebSocket(
      process.env.NEXT_PUBLIC_WEBSOCKT_URL + '/socket'
    );

    // 接続時の処理
    socketRef.current.onopen = function () {
      // StreamIdを送る
      const msg: MsgFromClient = {
        stream_id: streamId,
        comment: '',
        reaction: false,
        is_connected: true
      };
      socketRef.current?.send(JSON.stringify(msg));
      setIsConnected(true);
      console.log('Connected');
    };

    // 切断時の処理
    socketRef.current.onclose = function () {
      console.log('closed');
      setIsConnected(false);
    };

    // Server側から送られてきたデータの処理
    socketRef.current.onmessage = function (event) {
      const obj: MsgFromServer = JSON.parse(event.data);
      setSentMessage({ ...obj, comments: obj.comments ?? [] });
      console.log(obj.comments);
    };
    return () => {
      if (socketRef.current == null) {
        return;
      }
      socketRef.current.close();
    };
  }, []);

  // return (
  //   <>
  //     <h1>WebSocket is connected : {`${isConnected}`}</h1>

  //     <form onSubmit={sendComment}>
  //       <input type='text' name='socketData' />
  //       <button type='submit'>Comment</button>
  //     </form>
  //     <button type='button' onClick={sendReaction}>
  //       Reaction
  //     </button>

  //     <h3>Comments: {sentMessage.comments}</h3>
  //     <h3>Reactions: {sentMessage.reaction}</h3>
  //   </>
  // );
  return (
    <div>
      <Player src={searchParams.url} />
      <Box sx={{ position: 'fixed', top: '20%' }}>
        <Title sx={{ textAlign: 'center' }}>{sentMessage.reaction}</Title>
        <Button onClick={sendReaction}>reaction</Button>
      </Box>
      <ScrollArea h={250}>
        <div>test</div>
        <Box sx={{ width: '80%', margin: 'auto' }}>
          {sentMessage.comments.map((e, i) => {
            return <Chatbox key={i} message={e} />;
          })}
        </Box>
        <div ref={scrollBottomRef} />
      </ScrollArea>
      <Box sx={{ width: '80%', margin: 'auto' }}>
        <TextInput
          value={message}
          onChange={(e) => setMassage(e.target.value)}
        ></TextInput>
        <Button onClick={sendComment} fullWidth>
          comment
        </Button>
      </Box>
    </div>
  );
};

export default Stream;
