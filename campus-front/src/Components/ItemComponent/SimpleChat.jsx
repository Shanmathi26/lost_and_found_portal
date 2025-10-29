import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Chat.css';

const SimpleChat = () => {
  const { otherUser } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUser = sessionStorage.getItem('currentUser');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderUsername: currentUser,
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, messageData]);
    setNewMessage('');
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
        <h3>Chat with {otherUser || 'User'}</h3>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="message own-message">
              <div className="message-content">{message.content}</div>
              <div className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
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

export default SimpleChat;