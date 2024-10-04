import React, { useState, useEffect, useRef } from "react";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from "axios";
import "./ChatRoom.css"; // Import CSS for styling

const ChatRoom = ({ user, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      setConnected(true);

      // Subscribe to the room
      stompClient.subscribe("/sub/chat/room/" + room, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessageHistory((prevMessages) => [...prevMessages, receivedMessage]);
      });

      // Send join message
      stompClient.send(
        "/pub/chat/join/" + room,
        {},
        JSON.stringify({
          message: `${user}님이 입장하셨습니다.`,
          user: user,
          roomNo: room,
          timeStamp: new Date().toISOString(),
        })
      );
    });

    stompClientRef.current = stompClient;

    // Retrieve past messages from Redis
    axios
      .get(`/api/messages/${room}`)
      .then((response) => {
        setMessageHistory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
    };
  }, [room, user]);

  const sendMessage = () => {
    if (stompClientRef.current && currentMessage.trim() !== "") {
      stompClientRef.current.send(
        "/pub/chat/message/" + room,
        {},
        JSON.stringify({
          message: currentMessage,
          user: user,
          roomNo: room,
          timeStamp: new Date().toISOString(),
        })
      );
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    // Scroll chat to the latest message
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messageHistory]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat Room: {room}</h2>
        <span>{connected ? "Connected" : "Connecting..."}</span>
      </div>
      <div className="chat-window" ref={chatWindowRef}>
        {messageHistory.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.user === user ? "my-message" : "other-message"
            }`}
          >
            <strong>{msg.user}</strong>: {msg.message}
            <div className="message-timestamp">
              {new Date(msg.timeStamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
