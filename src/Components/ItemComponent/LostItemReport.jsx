import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { lostItemList, lostItemSubmission } from '../../Services/LostItemService';
import { getUserDetails } from '../../Services/LoginService';
import { getfoundItemById } from '../../Services/FoundItemService';
import { sendNotification } from '../../Services/NotificationService';
import { getCurrentUser, getUserRole, clearSession } from '../../Services/SessionService';
import NotificationBell from './NotificationBell';
import './LostItemReport.css';

const LostItemReport = () => {
  const navigate = useNavigate();
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [foundItemImages, setFoundItemImages] = useState({});
  const userRole = getUserRole();

  const showAllLostItems = () => {
    lostItemList()
      .then((response) => {
        const allItems = response.data || [];
        console.log('=== FRONTEND DEBUG ===');
        console.log('All items from backend:', allItems);
        console.log('Current user:', currentUser);
        console.log('User role:', userRole);
        if (userRole === 'Admin') {
          setItemList(allItems);
        } else {
          console.log('Filtering items for user:', currentUser);
          allItems.forEach(item => {
            console.log(`Item username: '${item.username}', Current user: '${currentUser}', Match: ${item.username === currentUser}`);
          });
          // Show all user's lost items regardless of status
          const userItems = allItems.filter(item => {
            return item.username === currentUser || 
                   item.username?.toLowerCase() === currentUser?.toLowerCase() ||
                   item.userEmail?.includes(currentUser) ||
                   currentUser?.includes(item.username);
          });
          console.log('Filtered user items:', userItems);
          console.log('Setting itemList with', userItems.length, 'items');
          setItemList(userItems);
          console.log('ItemList state updated');
          
          // Fetch found item images for matched items
          userItems.forEach(item => {
            if (item.matchedItemId || item.matched_item_id) {
              const foundItemId = item.matchedItemId || item.matched_item_id;
              getfoundItemById(foundItemId)
                .then(response => {
                  if (response.data && response.data.imageUrl) {
                    setFoundItemImages(prev => ({
                      ...prev,
                      [foundItemId]: response.data.imageUrl
                    }));
                  }
                })
                .catch(err => console.log('Error fetching found item image:', err));
            }
          });
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching lost items:', error);
        setItemList([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Try multiple sources for username
    const username = getCurrentUser();
    if (username) {
      setCurrentUser(username);
    }
  }, []);
  
  useEffect(() => {
    if (currentUser) {
      showAllLostItems();
    }
  }, [currentUser, showAllLostItems]);



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

  const handleMarkAsFound = (item) => {
    const updatedItem = { ...item, status: true };
    lostItemSubmission(updatedItem)
      .then(() => {
        setItemList(itemList.filter(i => i.itemId !== item.itemId));
        alert('Item marked as found successfully!');
      })
      .catch((error) => {
        console.error('Error updating item status:', error);
        alert('Failed to mark item as found. Please try again.');
      });
  };

  const handleConfirmMatch = (item, confirmed) => {
    if (confirmed) {
      // Mark item as found (status = true)
      const foundItem = { ...item, status: true };
      lostItemSubmission(foundItem)
        .then(() => {
          // Send notification to the finder
          const notification = {
            username: item.finder_username || item.finderUsername,
            title: 'Match Confirmed! 🎉',
            message: `Great news! ${item.username} has confirmed that the ${item.itemName} you found is theirs. Please contact them at ${item.userEmail} to arrange pickup.`,
            type: 'MATCH_CONFIRMED',
            relatedItemId: item.matched_item_id || item.matchedItemId,
            matchedItemId: item.itemId
          };
          
          sendNotification(notification)
            .then(() => {
              alert('Match confirmed! The finder has been notified. Item moved to found status.');
            })
            .catch(() => {
              alert('Match confirmed! Please contact the finder to collect your item.');
            });
          
          showAllLostItems(); // Refresh the list
        })
        .catch(() => {
          alert('Failed to update item status. Please try again.');
        });
    } else {
      // Clear match data in database
      const clearMatchData = {
        itemId: item.itemId,
        username: item.username,
        userEmail: item.userEmail,
        itemName: item.itemName,
        category: item.category,
        color: item.color,
        brand: item.brand,
        location: item.location,
        lostDate: item.lostDate,
        status: false,
        matchedItemId: "",
        matchStatus: "",
        matchConfidence: 0,
        matchDate: "",
        finderUsername: "",
        finderEmail: ""
      };
      
      lostItemSubmission(clearMatchData)
        .then(() => {
          alert('Match rejected. We will continue looking for your item.');
          showAllLostItems(); // Refresh the list
        })
        .catch(() => {
          alert('Failed to reject match. Please try again.');
        });
    }
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

  const filteredItems = itemList.filter(item => fuzzySearch(item, searchTerm));
  console.log('Final filtered items for display:', filteredItems.length);

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
          <NotificationBell />
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <h2>{userRole === 'Admin' ? 'All Lost Items' : 'My Lost Items'}</h2>
        <p>{userRole === 'Admin' ? 'View all reported lost items' : 'View your reported lost items'}</p>
        
        <div className="header-actions">
          <button className="back-btn" onClick={returnBack}>
            ← Back
          </button>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search items, categories, locations, or owners..."
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
            <span className="stat-label">Lost Items</span>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="no-items">
          <div className="no-items-icon">📋</div>
          <h3>No lost items found</h3>
          <p>{searchTerm ? 'No items match your search criteria' : 'No items have been reported lost yet'}</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map((item, index) => (
            <div key={item.itemId || index} className="item-card lost">
              <div className="card-header">
                <div className="item-id">#{item.itemId}</div>
                <div className={`status-badge ${item.status ? 'found' : 'lost'}`}>
                  {item.status ? 'FOUND' : 'LOST'}
                </div>
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
                    <h4>Lost Information</h4>
                    <div className="detail-row">
                      <span className="label">Lost Location:</span>
                      <span className="value location">{item.location || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Lost Date:</span>
                      <span className="value">{item.lostDate || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>Reporter Contact</h4>
                    <div className="detail-row">
                      <span className="label">Reported By:</span>
                      <span className="value">{item.username || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Contact:</span>
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
                      <h4>Status Information</h4>
                      <div className="detail-row">
                        <span className="label">Status:</span>
                        <span className={`value status-value ${item.status ? 'found' : 'lost'}`}>
                          {item.status ? 'Found' : 'Not Found'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {(item.matched_item_id || item.matchedItemId) && (
                    <div className="detail-section">
                      <h4>🎉 Match Information</h4>
                      <div className="match-banner">
                        <span className="match-status">{(item.match_status || item.matchStatus) === 'PENDING' ? 'POTENTIAL MATCH FOUND!' : (item.match_status || item.matchStatus)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Found Item ID:</span>
                        <span className="value">#{item.matched_item_id || item.matchedItemId}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Match Confidence:</span>
                        <span className="value">{item.match_confidence || item.matchConfidence}%</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Match Date:</span>
                        <span className="value">{item.match_date || item.matchDate}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Found By:</span>
                        <span className="value">{item.finder_username || item.finderUsername}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Finder Contact:</span>
                        <span className="value">{item.finder_email || item.finderEmail}</span>
                      </div>
                      {foundItemImages[item.matched_item_id || item.matchedItemId] && (
                        <div className="detail-row">
                          <span className="label">Found Item Image:</span>
                          <div className="found-item-image">
                            <img 
                              src={foundItemImages[item.matched_item_id || item.matchedItemId]} 
                              alt="Found item" 
                              className="report-image" 
                            />
                          </div>
                        </div>
                      )}
                      {(item.match_status || item.matchStatus) === 'PENDING' && userRole !== 'Admin' && (
                        <div className="match-actions">
                          <button
                            className="confirm-btn"
                            onClick={() => handleConfirmMatch(item, true)}
                          >
                            Confirm This Is My Item
                          </button>
                          <button
                            className="chat-btn"
                            onClick={() => navigate(`/chat/${item.finder_username || item.finderUsername}`)}
                          >
                            💬 Chat with Finder
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleConfirmMatch(item, false)}
                          >
                            This Is Not My Item
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {userRole === 'Admin' && !item.status && (
                    <div className="action-section">
                      <button
                        className="mark-found-btn"
                        onClick={() => handleMarkAsFound(item)}
                      >
                        Mark as Found
                      </button>
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

export default LostItemReport;