import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserConversations } from '../../Services/ChatService';
import { getAllStudents } from '../../Services/LoginService';
import { getCurrentUser } from '../../Services/SessionService';
import './ChatList.css';

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [students, setStudents] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadConversations();
    loadStudents();
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

  const loadStudents = async () => {
    try {
      const response = await getAllStudents();
      const filteredStudents = response.data.filter(student => student.username !== currentUser);
      setStudents(filteredStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const openChat = (otherUser) => {
    setShowNewChat(false);
    navigate(`/chat/${otherUser}`);
  };

  if (loading) return <div className="loading">Loading chats...</div>;

  return (
    <div className="chat-list">
      <div className="chat-header">
        <div className="left-section">
          <button onClick={() => navigate('/StudentMenu')} className="back-btn">← Back</button>
          <h2>My Chats</h2>
        </div>
        <button onClick={() => setShowNewChat(!showNewChat)} className="new-chat-btn">
          + New Chat
        </button>
      </div>
      
      {showNewChat && (
        <div className="new-chat-section">
          <h3>Start New Chat</h3>
          <div className="students-list">
            {students.map((student) => (
              <div key={student.username} className="student-item" onClick={() => openChat(student.username)}>
                <div className="user-info">
                  <h4>{student.username}</h4>
                  <p>{student.email}</p>
                </div>
                <div className="chat-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="no-chats">No conversations yet</div>
      ) : (
        <div className="conversations">
          <h3>Recent Chats</h3>
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