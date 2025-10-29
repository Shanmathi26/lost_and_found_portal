import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../../Services/LoginService";
import { getCurrentUser, getUserRole, clearSession } from "../../Services/SessionService";
import NotificationBell from '../ItemComponent/NotificationBell';
import './StudentMenu.css';

const StudentMenu = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    role: 'Student'
  });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    getUserDetails()
      .then((response) => {
        const userData = response.data || {};
        setUserDetails({
          username: userData.username || '',
          email: userData.email || '',
          role: 'Student'
        });
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        const username = sessionStorage.getItem('currentUser') || '';
        setUserDetails({
          username: username,
          email: username ? `${username}@student.edu` : '',
          role: 'Student'
        });
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-profile')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  const handleDropdownOption = (option) => {
    setShowProfileDropdown(false); // Close dropdown on any option click
    if (option === 'Profile') {
      navigate('/user-profile');
    } else if (option === 'Lost Item') {
      navigate('/user-lost-item'); // Replace with your Lost Item URL
    } else if (option === 'Found Item') {
      navigate('/user-found-item'); // Replace with your Found Item URL
    }
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Lost Found Student Menu</h1>
            <p>Welcome back, {userDetails.username}!</p>
          </div>
          <div className="header-actions">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
            <NotificationBell />
            <div className="user-profile">
              <button className="profile-icon-btn" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                <div className="profile-icon">
                  {userDetails.username.charAt(0).toUpperCase()}
                </div>
              </button>
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <button
                    className="dropdown-item"
                    onClick={() => handleDropdownOption('Profile')}
                  >
                    Profile
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDropdownOption('Lost Item')}
                  >
                    Lost Item
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handleDropdownOption('Found Item')}
                  >
                    Found Item
                  </button>
                </div>
              )}
              {showProfileDropdown && handleDropdownOption === 'Profile' && (
                <div className="user-details-popup">
                  <div className="user-avatar">
                    {userDetails.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h3>{userDetails.username}</h3>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Role:</strong> {userDetails.role}</p>
                  </div>
                  <button className="close-popup" onClick={() => setShowProfileDropdown(false)}>×</button>
                </div>
              )}
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="quick-actions">
          <h2>Items</h2>
          <div className="action-buttons">
            <button className="action-btn primary" onClick={() => navigate('/lost-item-submission')} style={{backgroundColor: '#e74c3c'}}>
              Lost Item Registration
            </button>
            <button className="action-btn secondary" onClick={() => navigate('/found-item-submission')} style={{backgroundColor: '#27ae60'}}>
              Found Item Submission
            </button>
            <button className="action-btn tertiary" onClick={() => navigate('/lost-item-report')} style={{backgroundColor: '#f39c12'}}>
              Lost Item Report
            </button>
            <button className="action-btn tertiary" onClick={() => navigate('/found-item-report')} style={{backgroundColor: '#f39c12'}}>
              Found Item Report
            </button>
            <button className="action-btn chat" onClick={() => navigate('/public-chat')} style={{backgroundColor: '#28a745'}}>
              💬 Campus Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMenu;