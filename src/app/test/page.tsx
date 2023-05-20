'use client';
import { useEffect, useState, useRef } from 'react';

const Test = () => {
  const [message, setMessage] = useState<string>();
  const socketRef = useRef<WebSocket>();

  // #0.WebSocket関連の処理は副作用なので、useEffect内で実装
  useEffect(() => {
    // #1.WebSocketオブジェクトを生成しサーバとの接続を開始
    const websocket = new WebSocket('ws://localhost:5000');
    socketRef.current = websocket;

    // #2.メッセージ受信時のイベントハンドラを設定
    const onMessage = (event: MessageEvent<string>) => {
      setMessage(event.data);
    };
    websocket.addEventListener('message', onMessage);

    // #3.useEffectのクリーンアップの中で、WebSocketのクローズ処理を実行
    return () => {
      websocket.close();
      websocket.removeEventListener('message', onMessage);
    };
  }, []);

  return (
    <>
      <div>最後に受信したメッセージ: {message}</div>
      <button
        type='button'
        onClick={() => {
          // #4.WebSocketでメッセージを送信する場合は、イベントハンドラ内でsendメソッドを実行
          socketRef.current?.send('送信メッセージ');
        }}
      >
        送信
      </button>
    </>
  );
};

export default Test;
