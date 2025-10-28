  import React, {useState} from "react";
  import { useNavigate } from 'react-router-dom';
  import './RegisterUser.css';
  import {registerNewUser} from '../../Services/LoginService';
  const RegisterUser=()=>
  {
    const [campusUser,setCampusUser] = useState({
          username:"",
          password: "",
          personName:"",
          email:"",
          role:"",
      });
    const [confirmPassword,setConfirmPassword]=useState("");
    let navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const saveUser = (event) => {
      event.preventDefault();
        if(campusUser.password===confirmPassword){
          registerNewUser(campusUser)
            .then((response)=>{
              alert(" User registered successfully! You can now sign in.");
              navigate('/');    
            })
            .catch((error) => {
              console.error('Registration error:', error);
              alert("Registration failed. Please try again.");
            });
      }
  };

  const  onChangeHandler = (event) =>{
      event.persist();
      const name = event.target.name;
          const value = event.target.value;
        setCampusUser(values =>({...values, [name]: value }));
      };

      const handleValidation = (event) => {
          event.preventDefault();
          let tempErrors = {};
          let isValid = true;
    
          if (!campusUser.username.trim()) {
            tempErrors.username = "User Name is required";
            isValid = false;
          }
          if (!campusUser.password.trim()) {
            tempErrors.password = "Password is required";
            isValid = false;
          }
          else if (campusUser.password.length < 5 || campusUser.passwordlength > 10) {
            tempErrors.password="Password must be 5-10 characters long";
            isValid = false;
          }
          else if (campusUser.password!==confirmPassword) {
            tempErrors.password="Both the passwords are not matched";
          isValid = false;
        }
          
          if (!campusUser.personName.trim()) {
              tempErrors.personName = "Personal Name is required";
              isValid = false;
            }
            if (!campusUser.email.trim()) {
              tempErrors.email = "Email is required";
              isValid = false;
            }
            else if(!emailPattern.test(campusUser.email)){
              tempErrors.email = "Invalid Email Format";
              isValid = false;
            }
  
            if (!campusUser.role.trim()) {
              tempErrors.role = "Role is required";
              isValid = false;
            }
            if (!confirmPassword.trim()) {
              tempErrors.confirmPassword = "Confirm Password is required";
              isValid = false;
            }
            setErrors(tempErrors);
          if (isValid) {
            saveUser(event);
          }
        };
    return(
      <div className="register-container">
        <div className="register-background">
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        
        <div className="register-card">
          <div className="register-header">
            <div className="logo">
              🎓
            </div>
            <h1>Join Campus Community</h1>
            <p>Create your account to access Lost & Found services</p>
          </div>
          
          <form className="register-form" onSubmit={handleValidation}>
            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={campusUser.username}
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
                    type="text"
                    name="personName"
                    placeholder="Your full name"
                    value={campusUser.personName}
                    onChange={onChangeHandler}
                    className={errors.personName ? 'error' : ''}
                  />
                </div>
                {errors.personName && <span className="error-message">{errors.personName}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@campus.edu"
                  value={campusUser.email}
                  onChange={onChangeHandler}
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon"></span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={campusUser.password}
                    onChange={onChangeHandler}
                    className={errors.password ? 'error' : ''}
                  />
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <div className="input-wrapper">
                  
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <select
                  name="role"
                  value={campusUser.role}
                  onChange={onChangeHandler}
                  className={errors.role ? 'error' : ''}
                >
                  <option value="">Select your role</option>
                  <option value="Student">Student</option>
                  <option value="Admin"> Admin</option>
                </select>
              </div>
              {errors.role && <span className="error-message">{errors.role}</span>}
            </div>
            
            <button type="submit" className="register-btn">
                Create Account
            </button>
          </form>
          
          <div className="register-footer">
            <div className="divider">
              <span>Already have an account?</span>
            </div>
            <button className="login-link-btn" onClick={() => navigate('/')}>
              Sign In Instead
            </button>
          </div>
        </div>
      </div>
  
  
  

    );
  
  
  
  
  };
  export default RegisterUser;