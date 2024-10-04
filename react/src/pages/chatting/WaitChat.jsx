import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function WaitChat() {
  const storedUser = localStorage.getItem('user');
  const navigate = useNavigate();
  const senderId = useSelector((state) => state.chat.memberId);

  let stompClient;

  const websocket = () => {
    const ws = new SockJS(`${import.meta.env.VITE_OMM_URL}/api/chat`);
    stompClient = Stomp.over(ws);

    stompClient.connect(
      (frame) => {
        stompClient.subscribe(`/sub/chat/room/${storedUser.id}`, (message) => {
          const recv = JSON.parse(message.body);
          navigate(`/chatwindow/${recv.id}`);
        });
      },
      (error) => {
      },
    );
  };

  const createChatting = () => {
    stompClient.connect((frame) => {
      stompClient.send(
        '/pub/chat/room',
        JSON.stringify({ senderId }),
        navigate('/chattings'),
        window.location.reload(),
      );
    });
  };

  useEffect(() => {
    websocket();
    createChatting();
  }, []);

  return (
    <div>
      <div className="text-3xl text-center mt-48">채팅방을 생성중입니다.</div>
    </div>
  );
}

export default WaitChat;
