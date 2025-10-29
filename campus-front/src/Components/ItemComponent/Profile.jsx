import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../../Services/LoginService";
import { lostItemListByUser } from "../../Services/LostItemService";
import { foundItemListByUser } from "../../Services/FoundItemService";
import { getUserNotifications } from "../../Services/NotificationService";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    role: "Student",
    phone: "",
    department: "",
    joinDate: ""
  });
  const [stats, setStats] = useState({
    lostItems: 0,
    foundItems: 0,
    notifications: 0,
    matchesFound: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDetails()
      .then((response) => {
        const userData = response.data || {};
        const username = userData.username || "";
        setUserDetails({
          username: username,
          email: userData.email || `${username}@student.edu`,
          role: "Student",
          phone: userData.phone || "+1 (555) 123-4567",
          department: userData.department || "Computer Science",
          joinDate: userData.joinDate || "September 2023"
        });
        
        // Fetch user statistics
        Promise.all([
          lostItemListByUser(username),
          foundItemListByUser(username),
          getUserNotifications(username)
        ]).then(([lostRes, foundRes, notifRes]) => {
          const lostItems = lostRes.data || [];
          const foundItems = foundRes.data || [];
          const notifications = notifRes.data || [];
          
          setStats({
            lostItems: lostItems.length,
            foundItems: foundItems.length,
            notifications: notifications.length,
            matchesFound: lostItems.filter(item => item.matchedItemId || item.matched_item_id).length
          });
        }).catch(err => console.log('Error fetching stats:', err));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        const username = sessionStorage.getItem("currentUser") || "";
        setUserDetails({
          username: username,
          email: username ? `${username}@student.edu` : "",
          role: "Student",
          phone: "+1 (555) 123-4567",
          department: "Computer Science",
          joinDate: "September 2023"
        });
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("userRole");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate("/StudentMenu")}>
            ← Back
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h2>User Profile</h2>
        <p>View your account details below</p>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <div className="profile-card">
            <div className="user-avatar">
              {userDetails.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <h3>{userDetails.username || "N/A"}</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Role:</strong>
                  <span>{userDetails.role}</span>
                </div>
              </div>
            </div>
          </div>
          

        </div>
      </div>
    </div>
  );
};

export default Profile;