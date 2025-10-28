import React from "react";
import { useNavigate } from "react-router-dom";
import './AdminMenu.css';

const AdminMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  const handleNavigate = (url) => {
    navigate(url);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Lost Found Admin Menu</h1>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="action-buttons">
          <button
            className="action-btn primary"
            onClick={() => handleNavigate('/StudentList')}
            style={{ backgroundColor: '#e74c3c' }}
          >
            Manage Students
          </button>
          <button
            className="action-btn secondary"
            onClick={() => handleNavigate('/lost-item-report')}
            style={{ backgroundColor: '#27ae60' }}
          >
            Manage Lost Items
          </button>
          <button
            className="action-btn tertiary"
            onClick={() => handleNavigate('/found-item-report')}
            style={{ backgroundColor: '#f39c12' }}
          >
            Manage Found Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;