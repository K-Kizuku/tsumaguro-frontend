'use client';
import { useEffect, useRef, useState } from 'react'

// テスト用, 形式は不問, 一意でさえあればOK
const streamId = "hogihogewiheqjpo"

type MsgFromClient = {
  stream_id: string
  comment: string
  reaction: boolean
}

const Test = () => {
  const socketRef = useRef<WebSocket>()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [formMessage, setFormMessage] = useState('')
  const [sentMessage, setSentMessage] = useState('')

  const sendComment = (e: any) => {
    e.preventDefault()
    setFormMessage(e.target[0].value)
    socketRef.current?.send(e.target[0].value)
  }

  const sendReaction = (e: any) => {

  }

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8001/socket')

    // 接続時の処理
    socketRef.current.onopen = function () {
      // StreamIdを送る
      const msg: MsgFromClient = {
        stream_id: streamId,
        comment: '',
        reaction: false
      }
      socketRef.current?.send(JSON.stringify(msg))
      console.log(JSON.stringify(msg))
      setIsConnected(true)
      console.log('Connected')
    }

    // 切断時の処理
    socketRef.current.onclose = function () {
      console.log('closed')
      setIsConnected(false)
    }

    // server 側から送られてきたデータを受け取る
    socketRef.current.onmessage = function (event) {
      setSentMessage(event.data)
    }

    return () => {
      if (socketRef.current == null) {
        return
      }
      socketRef.current.close()
    }
  }, [])

  return (
    <>
      <h1>WebSocket is connected : {`${isConnected}`}</h1>

      <form onSubmit={sendComment}>
        <input type="text" name="socketData" />
        <button type="submit">Comment</button>
      </form>
      <button type="button" onClick={sendReaction}>Reaction</button>

      <h3>form message: {formMessage}</h3>
      <h3>sent message: {sentMessage}</h3>

    </>
  )
}

export default Test