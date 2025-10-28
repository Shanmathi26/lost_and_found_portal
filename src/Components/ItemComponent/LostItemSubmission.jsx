import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { lostItemSubmission, lostitemIdGenerator } from "../../Services/LostItemService";
import { getUserDetails } from "../../Services/LoginService";
import './LostItemSubmission.css';

const LostItemSubmission = () => {
  const [item, setItem] = useState({
    itemId: "",
    username: "",
    userEmail: "",
    itemName: "",
    category: "",
    color: "",
    brand: "",
    location: "",
    lostDate: new Date().toISOString().split("T")[0],
    status: false,
    imageUrl: ""
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('userRole');
    navigate('/');
  };

  useEffect(() => {
    getUserDetails()
      .then((response) => {
        const userData = response.data || {};
        if (!userData.username) {
          navigate('/'); // Redirect to login if no user details
          return;
        }
        lostitemIdGenerator()
          .then((res) => {
            setItem((prev) => ({
              ...prev,
              itemId: res.data || 'ITEM_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
              username: userData.username || '',
              userEmail: userData.email || ''
            }));
          })
          .catch((err) => {
            console.error('Error generating item ID:', err);
            const localId = 'ITEM_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            setItem((prev) => ({
              ...prev,
              itemId: localId,
              username: userData.username || '',
              userEmail: userData.email || ''
            }));
          });
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        navigate('/'); // Redirect to login if user details fetch fails
      });
  }, [navigate]);

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
    if (!item.lostDate) errors.push('Lost Date');
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert(`Please fill in the following required fields: ${validationErrors.join(', ')}`);
      return;
    }
    
    lostItemSubmission(item)
      .then(() => {
        alert("Lost Item submitted successfully!");
        getUserDetails()
          .then((response) => {
            const userData = response.data || {};
            if (!userData.username) {
              navigate('/'); // Redirect to login if no user details
              return;
            }
            lostitemIdGenerator()
              .then((res) => {
                setItem({
                  itemId: res.data || 'ITEM_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                  username: userData.username || '',
                  userEmail: userData.email || '',
                  itemName: "",
                  category: "",
                  color: "",
                  brand: "",
                  location: "",
                  lostDate: new Date().toISOString().split("T")[0],
                  status: false
                });
              })
              .catch((err) => {
                console.error('Error generating item ID on reset:', err);
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
                  lostDate: new Date().toISOString().split("T")[0],
                  status: false
                });
              });
          })
          .catch((error) => {
            console.error('Error fetching user details on reset:', error);
            navigate('/'); // Redirect to login if user details fetch fails
          });
      })
      .catch((error) => {
        console.error('Submission error:', error);
        alert('Error submitting item. Please check your backend connection.');
      });
  };

  return (
    <div className="lost-item-container">
      <div className="form-header">
        <div className="header-top">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <h2>Report Lost Item</h2>
        <p>Help us help you find your lost item by providing detailed information</p>
      </div>
      
      <form className="lost-item-form" onSubmit={handleSubmit}>
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
              <label>Lost Location *</label>
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
              <label>Date Lost *</label>
              <input
                type="date"
                name="lostDate"
                value={item.lostDate}
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
            Submit Lost Item Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default LostItemSubmission;