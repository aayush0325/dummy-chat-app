import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('http://192.168.123.92:3000');

interface Message {
  username: string;
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    socket.on('connect', (): void => {
      console.log('connected to the server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }, []);

  useEffect(() => {
    const handleMessage = (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, []);

  const sendMessage = () => {
    socket.emit('sendMessage', { username, text: messageText });
    setMessageText('');
  };

  return (
    <div className='bg-black w-screen h-screen flex flex-col justify-center items-center'>
      <div className='font-bold text-3xl text-white text-center m-8'>
        Dummy Chat Application
      </div>
      <div>
        {messages.map((message, index) => (
          <RenderMessage key={index} username={message.username} message={message.text} />
        ))}
      </div>
      <div className='flex justify-center items-center m-2'>
        <input
          type='text'
          placeholder='Set username'
          className='bg-white border-none rounded p-2'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className='flex justify-center items-center m-2'>
        <input
          type='text'
          placeholder='Send message'
          className='bg-white border-none rounded p-2'
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
      </div>
      <div className='flex justify-center m-2'>
        <button
          className='bg-blue-600 text-white font-bold text-center w-auto text-lg p-2 hover:px-4 transition-all duration-300 rounded'
          onClick={sendMessage}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}

function RenderMessage({ username, message }: { username: string; message: string }) {
  return (
    <div className='text-white text-center'>
      {username}: {message}
    </div>
  );
}

export default App;
