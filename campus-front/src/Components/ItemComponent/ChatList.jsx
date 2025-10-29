import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserConversations } from '../../Services/ChatService';
import './ChatList.css';

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username') || sessionStorage.getItem('currentUser');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await getUserConversations(currentUser);
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const openChat = (otherUser) => {
    navigate(`/chat/${otherUser}`);
  };

  if (loading) return <div className="loading">Loading chats...</div>;

  return (
    <div className="chat-list">
      <div className="chat-header">
        <button onClick={() => navigate('/StudentMenu')} className="back-btn">← Back</button>
        <h2>My Chats</h2>
      </div>
      
      {conversations.length === 0 ? (
        <div className="no-chats">No conversations yet</div>
      ) : (
        <div className="conversations">
          {conversations.map((user) => (
            <div key={user} className="conversation-item" onClick={() => openChat(user)}>
              <div className="user-info">
                <h4>{user}</h4>
              </div>
              <div className="chat-arrow">→</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;