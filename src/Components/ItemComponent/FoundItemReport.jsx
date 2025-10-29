import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { foundItemList } from '../../Services/FoundItemService';
import { lostItemList } from '../../Services/LostItemService';
import { getCurrentUser, getUserRole, clearSession } from '../../Services/SessionService';
import NotificationBell from './NotificationBell';
import './FoundItemReport.css';

const FoundItemReport = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifiedUsers, setNotifiedUsers] = useState({});

  useEffect(() => {
    const currentUser = getCurrentUser();
    foundItemList()
      .then((response) => {
        let items = response.data || [];
        if (userRole === 'Admin') {
          // Admin sees all items
        } else {
          // Students see only their own found items with status false
          items = items.filter(item => item.username === currentUser && !item.status);
        }
        // Load notified users for each found item
        loadNotifiedUsers(items);
        setFoundItems(items);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching found items:', error);
        setFoundItems([]);
        setLoading(false);
      });
  }, [userRole]);

  const returnBack = () => {
    if (userRole === 'Admin') {
      navigate('/AdminMenu');
    } else {
      navigate('/StudentMenu');
    }
  };

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  const fuzzySearch = (item, searchTerm) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;
    
    const fields = [
      item.itemName || '',
      item.category || '',
      item.location || '',
      item.username || '',
      item.color || '',
      item.brand || ''
    ];
    
    if (userRole === 'Admin') {
      fields.push(String(item.status));
    }
    
    return fields.some(field => {
      const text = field.toLowerCase();
      
      // 1. Exact substring match (highest priority)
      if (text.includes(search)) return true;
      
      // 2. Word boundary match
      const words = text.split(/\s+/);
      if (words.some(word => word.startsWith(search))) return true;
      
      // 3. Acronym match (e.g., "cs" matches "Computer Science")
      if (search.length >= 2) {
        const acronym = words.map(word => word[0]).join('');
        if (acronym.includes(search)) return true;
      }
      
      // 4. Fuzzy match using Levenshtein distance
      if (search.length >= 3) {
        return words.some(word => {
          if (word.length < 3) return false;
          return calculateSimilarity(word, search) >= 0.7;
        });
      }
      
      return false;
    });
  };

  const calculateSimilarity = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    
    if (len1 === 0) return len2 === 0 ? 1 : 0;
    if (len2 === 0) return 0;
    
    // Quick similarity check for performance
    if (Math.abs(len1 - len2) > Math.max(len1, len2) * 0.5) return 0;
    
    const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));
    
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
  };

  const loadNotifiedUsers = async (items) => {
    try {
      const lostItemsResponse = await lostItemList();
      const lostItems = lostItemsResponse.data || [];
      
      console.log('Found items:', items);
      console.log('Lost items:', lostItems);
      
      const usersMap = {};
      items.forEach(foundItem => {
        console.log(`Checking matches for found item ${foundItem.itemId}`);
        // Find lost items that match this found item
        const matchedLostItems = lostItems.filter(lostItem => {
          const match = (lostItem.matchedItemId === foundItem.itemId || lostItem.matched_item_id === foundItem.itemId) &&
                       lostItem.username !== foundItem.username;
          if (match) {
            console.log(`Found match: ${lostItem.username} for item ${foundItem.itemId}`);
          }
          return match;
        });
        usersMap[foundItem.itemId] = matchedLostItems.map(item => item.username);
        console.log(`Notified users for ${foundItem.itemId}:`, usersMap[foundItem.itemId]);
      });
      
      console.log('Final notified users map:', usersMap);
      setNotifiedUsers(usersMap);
    } catch (error) {
      console.error('Error loading notified users:', error);
    }
  };

  const filteredItems = foundItems.filter(item => fuzzySearch(item, searchTerm));

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
          <NotificationBell />
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <h2>Found Items Report</h2>
        <p>Items that have been found and are ready for pickup</p>
        
        <div className="header-actions">
          <button className="back-btn" onClick={returnBack}>
            ← Back
          </button>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search found items, categories, or owners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="return-btn" onClick={returnBack}>
            Return to Menu
          </button>
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
          <p>{searchTerm ? 'No items match your search criteria' : 'No items have been marked as found yet'}</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item, index) => (
            <div key={item.itemId || index} className="item-card found">
              <div className="card-header">
                <div className="item-id">#{item.itemId}</div>
                {userRole === 'Admin' ? (
                  <div className={`status-badge ${item.status ? 'returned' : 'pending'}`}>
                    {item.status ? 'Returned' : 'Pending Return'}
                  </div>
                ) : (
                  <div className="status-badge found">FOUND</div>
                )}
              </div>
              
              <div className="card-content">
                <h3 className="item-name">{item.itemName || 'Unknown Item'}</h3>
                
                <div className="item-details">
                  <div className="detail-section">
                    <h4>Item Information</h4>
                    <div className="detail-row">
                      <span className="label">Category:</span>
                      <span className="value">{item.category || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Color:</span>
                      <span className="value">{item.color || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Brand:</span>
                      <span className="value">{item.brand || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Location Information</h4>
                    <div className="detail-row">
                      <span className="label">Location:</span>
                      <span className="value location">{item.location || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Found Information</h4>
                    <div className="detail-row">
                      <span className="label">Found Date:</span>
                      <span className="value found-date">{item.foundDate || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Reporter Contact</h4>
                    <div className="detail-row">
                      <span className="label">Reporter:</span>
                      <span className="value">{item.username || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span className="value">{item.userEmail || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {item.imageUrl && (
                    <div className="detail-section">
                      <h4>Item Image</h4>
                      <div className="item-image">
                        <img src={item.imageUrl} alt={item.itemName} className="report-image" />
                      </div>
                    </div>
                  )}

                  {userRole === 'Admin' && (
                    <div className="detail-section">
                      <h4>Status</h4>
                      <div className="detail-row">
                        <span className="label">Status:</span>
                        <span className={`value ${item.status ? 'returned' : 'pending'}`}>
                          {item.status ? 'Returned (True)' : 'Not Returned (False)'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoundItemReport;