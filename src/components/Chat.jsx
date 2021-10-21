import React, { useEffect, useState } from 'react';
import MessageCard from './MessageCard';
import trucksSocket from '../socketService';

function Chat() {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [messagesList, setMessagesList] = useState([]);

  const sendMessage = () => {
    if (nickname && message) {
      trucksSocket.emit('CHAT', { message, name: nickname });
      setMessage('');
    }
  };

  useEffect(() => {
    const existingNickname = localStorage.getItem('nickname');
    if (existingNickname) setNickname(existingNickname);
  }, []);

  useEffect(() => {
    trucksSocket.on('CHAT', (receivedMessage) => {
      setMessagesList((prevMessagesList) => [...prevMessagesList, receivedMessage]);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('nickname', nickname);
  }, [nickname]);

  return (
    <article className="col-4 px-2 py-2">
      <section className="row">
        <h1 className="col-7 align-items-center">Centro de Control</h1>
        <div className="col-3 py-1">
          <label htmlFor="nickname-input" className="h-4">Nickname</label>
          <input
            type="text"
            id="nickname-input"
            className="row h-6 black-border"
            placeholder="Elige un Nickname..."
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
          />
        </div>
      </section>
      <section className="col-10 messages black-border">
        <div className="row sent-messages">
          <ul className="col-10 my-0">
            {
              messagesList.map((msg) => (
                <MessageCard
                  date={msg.date}
                  message={msg.message}
                  name={msg.name}
                  isMyMessage={msg.name === nickname}
                  key={`${msg.name}-${msg.date}`}
                />
              ))
            }
          </ul>
        </div>
        <div className="row messages-form">
          <input
            type="text"
            className="col-8 black-border"
            placeholder="Escribe algo..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button
            type="button"
            className="col-2 black-border justify-center"
            disabled={!nickname || !message}
            onClick={sendMessage}
          >
            {nickname ? 'Send' : 'Choose a nickname'}
          </button>
        </div>
      </section>
    </article>
  );
}

export default Chat;
