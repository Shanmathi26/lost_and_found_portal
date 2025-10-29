import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import {validateUser} from '../../Services/LoginService';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const checkLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    
    validateUser(formData.username, formData.password)
      .then((response) => {
        console.log('Login response:', response.data);
        let role = String(response.data);
        console.log('Role:', role);
        if (role === "Admin" || role === "Student") {
          sessionStorage.setItem('currentUser', formData.username);
          sessionStorage.setItem('userRole', role);
          if (role === "Admin")
            navigate('/AdminMenu');
          else
            navigate('/StudentMenu');
        } else {
          alert("Invalid credentials");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Login error:', error);
        console.log('Error details:', error.response?.data);
        alert("❌ Login failed. Please check your credentials.");
        setLoading(false);
      });
  };

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(values => ({ ...values, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleValidation = (event) => {
    event.preventDefault();
    let tempErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      tempErrors.username = "Username is required";
      isValid = false;
    }
    if (!formData.password.trim()) {
      tempErrors.password = "Password is required";
      isValid = false;
    }
    setErrors(tempErrors);
    if (isValid) {
      checkLogin(event);
    }
  };

  const registerNewUser = (e) => {
    navigate('/Register');
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            🎓
          </div>
          <h1>Campus Lost & Found</h1>
          <p>Welcome back! Please sign in to your account</p>
        </div>
        
        <form className="login-form" onSubmit={handleValidation}>
          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon"></span>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={onChangeHandler}
                className={errors.username ? 'error' : ''}
              />
            </div>
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>
          
          <div className="form-group">
            <div className="input-wrapper">
              <span className="input-icon"></span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={onChangeHandler}
                className={errors.password ? 'error' : ''}
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              ' Sign In'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <div className="divider">
            <span>Don't have an account?</span>
          </div>
          <button className="register-btn" onClick={registerNewUser}>
             Create New Account
          </button>
        </div>
        

      </div>
    </div>
  );
};

export default LoginPage;