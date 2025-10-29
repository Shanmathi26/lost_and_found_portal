import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, clearSession } from '../../Services/SessionService';
import './PublicChat.css';

const PublicChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const messagesEndRef = useRef(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9999/chat');
    
    ws.onopen = () => {
      console.log('✅ Connected to chat');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    ws.onclose = () => {
      console.log('❌ Disconnected from chat');
    };

    ws.onerror = (error) => {
      console.error('🚨 WebSocket error:', error);
    };

    // Store WebSocket reference
    window.chatSocket = ws;

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (!window.chatSocket) return;

    const messageData = {
      username: currentUser,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    window.chatSocket.send(JSON.stringify(messageData));
    setNewMessage('');
  };

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  return (
    <div className="public-chat">
      <div className="chat-header">
        <button onClick={() => navigate('/StudentMenu')} className="back-btn">← Back</button>
        <h3>Campus Public Chat</h3>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.username === currentUser ? 'own-message' : 'other-message'}`}
          >
            <div className="message-header">
              <span className="username">{message.username}</span>
              <span className="timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-btn">Send</button>
      </form>
    </div>
  );
};

export default PublicChat;