import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { foundItemSubmission, founditemIdGenerator } from "../../Services/FoundItemService";
import { getUserDetails } from "../../Services/LoginService";
import { lostItemList } from "../../Services/LostItemService";
import { sendNotification } from "../../Services/NotificationService";
import { findMatchesWithAutoNotify } from "../../Services/MatchingService";
import NotificationToast from './NotificationToast';
import './FoundItemSubmission.css';

const FoundItemSubmission = () => {
  const [item, setItem] = useState({
    itemId: "",
    username: "",
    userEmail: "",
    itemName: "",
    category: "",
    color: "",
    brand: "",
    location: "",
    foundDate: new Date().toISOString().split("T")[0],
    status: false,
    imageUrl: ""
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  useEffect(() => {
    const prefillData = sessionStorage.getItem('prefillFoundItem');
    
    getUserDetails()
      .then((response) => {
        const userData = response.data || {};
        founditemIdGenerator()
          .then((res) => {
            const baseItem = {
              itemId: res.data,
              username: userData.username || '',
              userEmail: userData.email || '',
              foundDate: new Date().toISOString().split("T")[0],
              status: false
            };
            
            if (prefillData) {
              const lostItem = JSON.parse(prefillData);
              setItem({
                ...baseItem,
                itemName: lostItem.itemName || '',
                category: lostItem.category || '',
                color: lostItem.color || '',
                brand: lostItem.brand || '',
                location: lostItem.location || ''
              });
              setIsPrefilled(true);
              sessionStorage.removeItem('prefillFoundItem');
            } else {
              setItem({
                ...baseItem,
                itemName: '',
                category: '',
                color: '',
                brand: '',
                location: ''
              });
            }
          })
          .catch((err) => {
            console.error('Error generating item ID:', err);
            const localId = 'ITEM_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            const baseItem = {
              itemId: localId,
              username: userData.username || '',
              userEmail: userData.email || '',
              foundDate: new Date().toISOString().split("T")[0],
              status: false
            };
            
            if (prefillData) {
              const lostItem = JSON.parse(prefillData);
              setItem({
                ...baseItem,
                itemName: lostItem.itemName || '',
                category: lostItem.category || '',
                color: lostItem.color || '',
                brand: lostItem.brand || '',
                location: lostItem.location || ''
              });
              setIsPrefilled(true);
              sessionStorage.removeItem('prefillFoundItem');
            } else {
              setItem({
                ...baseItem,
                itemName: '',
                category: '',
                color: '',
                brand: '',
                location: ''
              });
            }
          });
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        const currentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || '';
        founditemIdGenerator()
          .then((res) => {
            const baseItem = {
              itemId: res.data,
              username: currentUser,
              userEmail: currentUser ? `${currentUser}@student.edu` : '',
              foundDate: new Date().toISOString().split("T")[0],
              status: false
            };
            
            if (prefillData) {
              const lostItem = JSON.parse(prefillData);
              setItem({
                ...baseItem,
                itemName: lostItem.itemName || '',
                category: lostItem.category || '',
                color: lostItem.color || '',
                brand: lostItem.brand || '',
                location: lostItem.location || ''
              });
              setIsPrefilled(true);
              sessionStorage.removeItem('prefillFoundItem');
            } else {
              setItem({
                ...baseItem,
                itemName: '',
                category: '',
                color: '',
                brand: '',
                location: ''
              });
            }
          })
          .catch((err) => {
            console.error('Error generating item ID:', err);
            const localId = 'ITEM_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            const baseItem = {
              itemId: localId,
              username: currentUser,
              userEmail: currentUser ? `${currentUser}@student.edu` : '',
              foundDate: new Date().toISOString().split("T")[0],
              status: false
            };
            
            if (prefillData) {
              const lostItem = JSON.parse(prefillData);
              setItem({
                ...baseItem,
                itemName: lostItem.itemName || '',
                category: lostItem.category || '',
                color: lostItem.color || '',
                brand: lostItem.brand || '',
                location: lostItem.location || ''
              });
              setIsPrefilled(true);
              sessionStorage.removeItem('prefillFoundItem');
            } else {
              setItem({
                ...baseItem,
                itemName: '',
                category: '',
                color: '',
                brand: '',
                location: ''
              });
            }
          });
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setItem({ ...item, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!item.itemName?.trim()) errors.push('Item Name');
    if (!item.category?.trim()) errors.push('Category');
    if (!item.color?.trim()) errors.push('Color');
    if (!item.brand?.trim()) errors.push('Brand');
    if (!item.location?.trim()) errors.push('Location');
    if (!item.foundDate) errors.push('Found Date');
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert(`Please fill in the following required fields: ${validationErrors.join(', ')}`);
      return;
    }
    
    foundItemSubmission(item)
      .then(() => {
        console.log('Found item submitted successfully, backend will handle notifications');
        setToastMessage("Found Item submitted successfully! Notifications sent to potential owners.");
        setToastType('success');
        setShowToast(true);
        
        getUserDetails()
          .then((response) => {
            const userData = response.data || {};
            const localId = 'ITEM_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            setItem({
              itemId: localId,
              username: userData.username || '',
              userEmail: userData.email || '',
              itemName: "",
              category: "",
              color: "",
              brand: "",
              location: "",
              foundDate: new Date().toISOString().split("T")[0],
              status: false
            });
          })
          .catch((error) => {
            console.error('Error fetching user details on reset:', error);
            const currentUser = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser') || '';
            const localId = 'ITEM_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            setItem({
              itemId: localId,
              username: currentUser,
              userEmail: currentUser ? `${currentUser}@student.edu` : '',
              itemName: "",
              category: "",
              color: "",
              brand: "",
              location: "",
              foundDate: new Date().toISOString().split("T")[0],
              status: false
            });
          });
      })
      .catch((error) => {
        console.error('Submission error:', error);
        setToastMessage('Error submitting item. Please check your backend connection.');
        setToastType('error');
        setShowToast(true);
      });
  };

  return (
    <div className="found-item-container">
      <div className="form-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <h2>Report Found Item</h2>
        <p>Help reunite found items with their owners by reporting them here</p>
      </div>
      
      <form className="found-item-form" onSubmit={handleSubmit}>
        {isPrefilled && (
          <div className="prefill-notice">
            <p>Form has been pre-filled with lost item details. Please verify and submit.</p>
          </div>
        )}

        <div className="form-section">
          <h3>Item Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Item Name *</label>
              <input
                type="text"
                name="itemName"
                placeholder="e.g., iPhone 13, Wallet, Keys"
                value={item.itemName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={item.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Personal Items">Personal Items</option>
                <option value="Documents">Documents</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Color *</label>
              <input
                type="text"
                name="color"
                placeholder="e.g., Black, Blue, Red"
                value={item.color}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Brand *</label>
              <input
                type="text"
                name="brand"
                placeholder="e.g., Apple, Samsung, Nike"
                value={item.brand}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Item Image</h3>
          <div className="form-group">
            <label>Upload Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Item preview" className="preview-image" />
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Location & Date</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Found Location *</label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Library, Cafeteria, Parking Lot"
                value={item.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date Found *</label>
              <input
                type="date"
                name="foundDate"
                value={item.foundDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Reporter Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="e.g., john_doe"
                value={item.username}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>User Email</label>
              <input
                type="email"
                name="userEmail"
                placeholder="e.g., john_doe@gmail.com"
                value={item.userEmail}
                onChange={handleChange}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit Found Item Report
          </button>
        </div>
      </form>
      
      {showToast && (
        <NotificationToast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default FoundItemSubmission;