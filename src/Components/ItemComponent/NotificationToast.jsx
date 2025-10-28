import React, { useState, useEffect } from 'react';
import './NotificationToast.css';

const NotificationToast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  return (
    <div className={`notification-toast ${type} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'warning' && '⚠️'}
          {type === 'info' && 'ℹ️'}
        </div>
        <div className="toast-message">{message}</div>
        <button className="toast-close" onClick={handleClose}>×</button>
      </div>
    </div>
  );
};

export default NotificationToast;