import React, { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationAsRead } from '../../Services/NotificationService';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(-1); // Start with -1 to avoid initial popup
  const currentUser = sessionStorage.getItem('currentUser');

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchNotifications = () => {
    getUserNotifications(currentUser)
      .then(response => {
        const notifs = response.data || [];
        const newUnreadCount = notifs.filter(n => !n.read).length;
        
        // Show popup for new notifications
        if (newUnreadCount > 0 && newUnreadCount > unreadCount && unreadCount >= 0) {
          alert(`🔔 New Notification!\nYou have ${newUnreadCount} unread notification(s). Click the bell to view.`);
        }
        
        setNotifications(notifs);
        setUnreadCount(newUnreadCount);
        
        // Debug logging
        console.log('Notifications fetched:', notifs.length, 'Unread:', newUnreadCount);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id)
        .then(() => {
          fetchNotifications();
        })
        .catch(error => {
          console.error('Error marking notification as read:', error);
        });
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="notification-bell">
      <button 
        className="bell-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button 
              className="close-btn"
              onClick={() => setShowDropdown(false)}
            >
              ×
            </button>
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatTime(notification.timestamp)}
                    </div>
                    {/* {notification.type === 'MATCH_FOUND' && notification.finderUsername && (
                      <button 
                        className="notification-chat-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/chat/${notification.finderUsername}`;
                        }}
                        style={{marginTop: '0.5rem', padding: '0.25rem 0.5rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '0.25rem', fontSize: '0.8rem'}}
                      >
                        💬 Chat with Finder
                      </button>
                    )} */}
                  </div>
                  {!notification.read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;