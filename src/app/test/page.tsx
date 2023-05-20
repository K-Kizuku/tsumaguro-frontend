'use client';
import { useEffect, useRef, useState } from 'react'

// テスト用, 形式は不問, 一意でさえあればOK
const streamId = "hogihogewiheqjpo"

type MsgFromClient = {
  stream_id: string
  comment: string
  reaction: boolean
  is_connected: boolean
}

type MsgFromServer = {
  comments: string[]
  reaction: number
}

const Test = () => {
  const socketRef = useRef<WebSocket>()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [formMessage, setFormMessage] = useState<string>('')
  const [sentMessage, setSentMessage] = useState<MsgFromServer>({comments: [], reaction: 0})

  const sendComment = (e: any) => {
    e.preventDefault()
    setFormMessage(e.target[0].value)
    socketRef.current?.send(e.target[0].value)
  }

  const sendReaction = (e: any) => {
    e.preventDefault()
    const msg: MsgFromClient = {
      stream_id: streamId,
      comment: '',
      reaction: true,
      is_connected: true
    }
    socketRef.current?.send(JSON.stringify(msg))
}

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8001/socket')

    // 接続時の処理
    socketRef.current.onopen = function () {
      // StreamIdを送る
      const msg: MsgFromClient = {
        stream_id: streamId,
        comment: '',
        reaction: false,
        is_connected: true
      }
      socketRef.current?.send(JSON.stringify(msg))
      setIsConnected(true)
      console.log('Connected')
    }

    // 切断時の処理
    socketRef.current.onclose = function () {
      console.log('closed')
      setIsConnected(false)
    }

    // Server側から送られてきたデータの処理
    socketRef.current.onmessage = function (event) {
      const obj: MsgFromServer = JSON.parse(event.data)
      setSentMessage(obj)
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

      <h3>Comments: {sentMessage.comments}</h3>
      <h3>Reactions: {sentMessage.reaction}</h3>

    </>
  )
}

export default Test