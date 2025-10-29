import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { foundItemListByUser, foundItemSubmission } from "../../Services/FoundItemService";
import { getUserDetails } from "../../Services/LoginService";
import "./UserFoundItem.css";

const UserFoundItem = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
  });
  const [foundItems, setFoundItems] = useState([]);
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
        // Fetch found items for the user
        foundItemListByUser(userData.username)
          .then((response) => {
            setFoundItems(response.data || []);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching found items:", error);
            setFoundItems([]);
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

  const handleMarkAsReturned = (item) => {
    const updatedItem = { ...item, status: true };
    foundItemSubmission(updatedItem)
      .then(() => {
        // Remove the item from the list after marking as returned
        setFoundItems(foundItems.filter((i) => i.itemId !== item.itemId));
        alert("Item marked as returned successfully!");
      })
      .catch((error) => {
        console.error("Error updating item status:", error);
        alert("Failed to mark item as returned. Please try again.");
      });
  };

  const filteredItems = foundItems.filter(
    (item) =>
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading found items...</p>
      </div>
    );
  }

  return (
    <div className="found-report-container">
      <div className="report-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate("/StudentMenu")}>
            ← Back
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h2>Found Items Report</h2>
        <p>Items you reported as found</p>

        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search found items, categories, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{filteredItems.length}</span>
            <span className="stat-label">Found Items</span>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="no-items">
          <div className="no-items-icon">🎯</div>
          <h3>No found items</h3>
          <p>{searchTerm ? "No items match your search criteria" : "You haven't reported any found items yet"}</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item, index) => (
            <div key={item.itemId || index} className="item-card found">
              <div className="card-header">
                <div className="item-id">#{item.itemId}</div>
                <div className="status-badge found">FOUND</div>
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
                    <h4>Found Information</h4>
                    <div className="detail-row">
                      <span className="label">Found Date:</span>
                      <span className="value found-date">{item.foundDate || "N/A"}</span>
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

                  {(item.matchedLostItemId || item.matched_lost_item_id) && (
                    <div className="detail-section">
                      <h4>🎉 Match Information</h4>
                      <div className="match-banner">
                        <span className="match-status">MATCHED WITH LOST ITEM!</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Lost Item ID:</span>
                        <span className="value">#{item.matchedLostItemId || item.matched_lost_item_id}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Owner:</span>
                        <span className="value">{item.ownerUsername || item.owner_username}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Owner Contact:</span>
                        <span className="value">{item.ownerEmail || item.owner_email}</span>
                      </div>
                    </div>
                  )}

                  <div className="action-section">
                    <button
                      className="mark-returned-btn"
                      onClick={() => handleMarkAsReturned(item)}
                    >
                      Mark as Returned
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

export default UserFoundItem;