'use client';
import { useEffect, useRef, useState } from 'react'

const Test = () => {
  const socketRef = useRef<WebSocket>()
  const [isConnected, setIsConnected] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [sentMessage, setSentMessage] = useState('')

  const sendData = (event: any) => {
    event.preventDefault()
    setFormMessage(event.target[0].value)
    socketRef.current?.send(event.target[0].value)
  }

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8001/socket')
    socketRef.current.onopen = function () {
      setIsConnected(true)
      console.log('Connected')
    }

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
      <form onSubmit={sendData}>
        <input type="text" name="socketData" />
        <button type="submit">Server に送信</button>
      </form>
      <h3>form message: {formMessage}</h3>
      <h3>sent message: {sentMessage}</h3>
    </>
  )
}

export default Test