import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { lostItemListByUser, lostItemSubmission } from "../../Services/LostItemService";
import { getUserDetails } from "../../Services/LoginService";
import "./UserLostItem.css";

const UserLostItem = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
  });
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUserDetails()
      .then((response) => {
        const userData = response.data || {};
        if (!userData.username) {
          navigate("/");
          return;
        }
        setUserDetails({
          username: userData.username || "",
          email: userData.email || "",
        });
        // Fetch lost items for the user
        lostItemListByUser(userData.username)
          .then((response) => {
            setLostItems(response.data || []);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching lost items:", error);
            setLostItems([]);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("userRole");
    navigate("/");
  };

  const handleMarkAsFound = (item) => {
    const updatedItem = { ...item, status: true };
    lostItemSubmission(updatedItem)
      .then(() => {
        // Remove the item from the list after marking as found
        setLostItems(lostItems.filter((i) => i.itemId !== item.itemId));
        alert("Item marked as found successfully!");
      })
      .catch((error) => {
        console.error("Error updating item status:", error);
        alert("Failed to mark item as found. Please try again.");
      });
  };

  const filteredItems = lostItems.filter(
    (item) =>
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading lost items...</p>
      </div>
    );
  }

  return (
    <div className="lost-report-container">
      <div className="report-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate("/StudentMenu")}>
            ← Back
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h2>Lost Items Report</h2>
        <p>Items you reported as lost</p>

        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search lost items, categories, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{filteredItems.length}</span>
            <span className="stat-label">Lost Items</span>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="no-items">
          <div className="no-items-icon">🎯</div>
          <h3>No lost items</h3>
          <p>{searchTerm ? "No items match your search criteria" : "You haven't reported any lost items yet"}</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item, index) => (
            <div key={item.itemId || index} className="item-card lost">
              <div className="card-header">
                <div className="item-id">#{item.itemId}</div>
                <div className="status-badge lost">LOST</div>
              </div>

              <div className="card-content">
                <h3 className="item-name">{item.itemName || "Unknown Item"}</h3>

                <div className="item-details">
                  <div className="detail-section">
                    <h4>Item Information</h4>
                    <div className="detail-row">
                      <span className="label">Category:</span>
                      <span className="value">{item.category || "N/A"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Color:</span>
                      <span className="value">{item.color || "N/A"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Brand:</span>
                      <span className="value">{item.brand || "N/A"}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Location Information</h4>
                    <div className="detail-row">
                      <span className="label">Location:</span>
                      <span className="value location">{item.location || "N/A"}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Lost Information</h4>
                    <div className="detail-row">
                      <span className="label">Lost Date:</span>
                      <span className="value lost-date">{item.lostDate || "N/A"}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Reporter Contact</h4>
                    <div className="detail-row">
                      <span className="label">Reporter:</span>
                      <span className="value">{item.username || "N/A"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span className="value">{item.userEmail || userDetails.email || "N/A"}</span>
                    </div>
                  </div>

                  <div className="action-section">
                    <button
                      className="mark-found-btn"
                      onClick={() => handleMarkAsFound(item)}
                    >
                      Mark as Found
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserLostItem;