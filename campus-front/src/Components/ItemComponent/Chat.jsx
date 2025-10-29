import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMessages, sendMessage } from '../../Services/ChatService';
import './Chat.css';

const Chat = () => {
  const { otherUser } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const currentUser = localStorage.getItem('username') || sessionStorage.getItem('currentUser');

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, [otherUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await getMessages(currentUser, otherUser);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        senderUsername: currentUser,
        receiverUsername: otherUser,
        content: newMessage,
        timestamp: new Date().toISOString()
      };
      
      // Add message to UI immediately
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
      
      // Send to backend
      await sendMessage(messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="loading">Loading chat...</div>;

  return (
    <div className="chat">
      <div className="chat-header">
        <button onClick={() => navigate('/chat-list')} className="back-btn">← Back</button>
        <h3>Chat with {otherUser}</h3>
      </div>
      
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.senderUsername === currentUser ? 'own-message' : 'other-message'}`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-time">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
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

export default Chat;