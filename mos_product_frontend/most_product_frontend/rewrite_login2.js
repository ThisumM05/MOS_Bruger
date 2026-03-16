const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaFacebookF, FaGithub, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../redux/slices/userSlice';

const Login = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.user);

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    if (location.pathname === '/signup') {
      setIsRightPanelActive(true);
    }
    dispatch(clearError());
  }, [location, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const togglePanel = (toRight) => {
    dispatch(clearError());
    setIsRightPanelActive(toRight);
  };

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginData));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    dispatch(register(registerData));
  };

  return (
    <>
      <style>{\`
        .auth-page-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 100px);
          background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('/image_2.jpg') no-repeat center center/cover;
          padding: 20px;
        }

        .auth-container {
          background-color: #fff;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 15px 20px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
          width: 900px;
          max-width: 100%;
          min-height: 550px;
        }

        .auth-form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
        }

        .sign-in-container {
          left: 0;
          width: 50%;
          z-index: 2;
        }

        .auth-container.right-panel-active .sign-in-container {
          transform: translateX(100%);
        }

        .sign-up-container {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
        }

        .auth-container.right-panel-active .sign-up-container {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: show 0.6s;
        }

        @keyframes show {
          0%, 49.99% { opacity: 0; z-index: 1; }
          50%, 100% { opacity: 1; z-index: 5; }
        }

        .auth-overlay-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: transform 0.6s ease-in-out;
          z-index: 100;
        }

        .auth-container.right-panel-active .auth-overlay-container {
          transform: translateX(-100%);
        }

        .auth-overlay {
          background: #d82b2b;
          background: linear-gradient(to right, #ba1c1c, #ff416c);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: 0 0;
          color: #ffffff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }

        .auth-container.right-panel-active .auth-overlay {
          transform: translateX(50%);
        }

        .auth-overlay-panel {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          text-align: center;
          top: 0;
          height: 100%;
          width: 50%;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }

        .auth-overlay-left {
          transform: translateX(-20%);
        }

        .auth-container.right-panel-active .auth-overlay-left {
          transform: translateX(0);
        }

        .auth-overlay-right {
          right: 0;
          transform: translateX(0);
        }

        .auth-container.right-panel-active .auth-overlay-right {
          transform: translateX(20%);
        }

        .auth-form {
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 50px;
          height: 100%;
          text-align: center;
        }

        .auth-title {
          font-weight: 800;
          margin: 0 0 10px;
          color: #222;
          font-family: inherit;
        }

        .overlay-title {
          font-weight: 800;
          margin: 0 0 15px;
          color: #fff;
          font-family: inherit;
          font-size: 2rem;
        }

        .social-container {
          margin: 15px 0;
        }

        .social-container a {
          border: 1px solid #DDDDDD;
          border-radius: 50%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin: 0 8px;
          height: 40px;
          width: 40px;
          color: #333;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-container a:hover {
          background-color: #d82b2b;
          color: white;
          border-color: #d82b2b;
          transform: scale(1.1);
        }

        .auth-span {
          font-size: 13px;
          color: #777;
          margin-bottom: 15px;
        }

        .auth-input-group {
          position: relative;
          margin: 8px 0;
          width: 100%;
        }

        .auth-input {
          background-color: #f6f6f6;
          border: 1px solid #eee;
          padding: 14px 15px 14px 45px;
          width: 100%;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }

        .auth-input:focus {
          background-color: #fff;
          border-color: #d82b2b;
          box-shadow: 0 0 8px rgba(216, 43, 43, 0.2);
        }

        .auth-icon {
          position: absolute;
          left: 17px;
          top: 50%;
          transform: translateY(-50%);
          color: #aaa;
          transition: color 0.3s ease;
        }

        .auth-input-group:focus-within .auth-icon {
          color: #d82b2b;
        }

        .forgot-password {
          color: #555;
          font-size: 13px;
          text-decoration: none;
          margin: 15px 0;
          transition: color 0.3s ease;
        }

        .forgot-password:hover {
          color: #d82b2b;
          text-decoration: underline;
        }

        .auth-btn {
          border-radius: 25px;
          border: 1px solid #d82b2b;
          background-color: #d82b2b;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          padding: 12px 45px;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: transform 80ms ease-in, background-color 0.3s ease;
          cursor: pointer;
          margin-top: 15px;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0px 4px 6px rgba(216, 43, 43, 0.3));
        }

        .auth-btn:hover {
            background-color: #ba1c1c;
        }

        .auth-btn:active {
          transform: scale(0.95);
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-btn.ghost {
          background-color: transparent;
          border-color: #ffffff;
          filter: none;
        }
        
        .auth-btn.ghost:hover {
          background-color: #fff;
          color: #d82b2b;
        }

        .auth-p {
          font-size: 15px;
          font-weight: 300;
          line-height: 22px;
          letter-spacing: 0.5px;
          margin: 15px 0 30px;
        }

        .error-message {
          background-color: #ffe6e6;
          color: #d82b2b;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 15px;
          width: 100%;
          border-left: 4px solid #d82b2b;
        }

        .loading-spinner {
          animation: spin 1.2s linear infinite;
          margin-right: 8px;
          font-size: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .auth-container {
            min-height: 650px;
            display: flex;
            flex-direction: column;
            width: 100%;
          }
          .auth-form {
              padding: 0 30px;
          }
        }
      \`}</style>

      <div className="auth-page-wrapper">
        <div className={\`auth-container \${isRightPanelActive ? 'right-panel-active' : ''}\`}>
          
          {/* Sign Up Form */}
          <div className="auth-form-container sign-up-container">
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <h1 className="auth-title">Create Account</h1>
              
              <div className="social-container">
                <a href="#facebook" onClick={(e)=>e.preventDefault()} className="social"><FaFacebookF /></a>
                <a href="#google" onClick={(e)=>e.preventDefault()} className="social"><FaGoogle /></a>
                <a href="#github" onClick={(e)=>e.preventDefault()} className="social"><FaGithub /></a>
              </div>
              <span className="auth-span">or use your email for registration</span>

              <div className="auth-input-group">
                <FaUser className="auth-icon" />
                <input type="text" name="username" className="auth-input" placeholder="Username" required value={registerData.username} onChange={handleRegisterChange} />
              </div>
              <div className="auth-input-group">
                <FaEnvelope className="auth-icon" />
                <input type="email" name="email" className="auth-input" placeholder="Email" required value={registerData.email} onChange={handleRegisterChange} />
              </div>
              <div className="auth-input-group">
                <FaLock className="auth-icon" />
                <input type="password" name="password" className="auth-input" placeholder="Password" required value={registerData.password} onChange={handleRegisterChange} />
              </div>
              
              {error && isRightPanelActive && (
                <div className="error-message">
                  <FaExclamationCircle /> {error}
                </div>
              )}
              
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading && <FaSpinner className="loading-spinner" />}
                {loading ? 'Registering...' : 'Sign Up'}
              </button>
            </form>
          </div>

          {/* Sign In Form */}
          <div className="auth-form-container sign-in-container">
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <h1 className="auth-title">Sign In</h1>
              
              <div className="social-container">
                <a href="#facebook" onClick={(e)=>e.preventDefault()} className="social"><FaFacebookF /></a>
                <a href="#google" onClick={(e)=>e.preventDefault()} className="social"><FaGoogle /></a>
                <a href="#github" onClick={(e)=>e.preventDefault()} className="social"><FaGithub /></a>
              </div>
              <span className="auth-span">or use your account</span>

              <div className="auth-input-group">
                <FaUser className="auth-icon" />
                <input type="text" name="username" className="auth-input" placeholder="Username" required value={loginData.username} onChange={handleLoginChange} />
              </div>
              <div className="auth-input-group">
                <FaLock className="auth-icon" />
                <input type="password" name="password" className="auth-input" placeholder="Password" required value={loginData.password} onChange={handleLoginChange} />
              </div>

              <a href="#forgot" onClick={(e)=>e.preventDefault()} className="forgot-password">Forgot your password?</a>
              
              {error && !isRightPanelActive && (
                <div className="error-message">
                  <FaExclamationCircle /> {error}
                </div>
              )}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading && <FaSpinner className="loading-spinner" />}
                {loading ? 'Logging In...' : 'Log In'}
              </button>
            </form>
          </div>

          {/* Overlay Container */}
          <div className="auth-overlay-container">
            <div className="auth-overlay">
              {/* Left Overlay (shown when Sign Up active) */}
              <div className="auth-overlay-panel auth-overlay-left">
                <h1 className="overlay-title">Welcome Back!</h1>
                <p className="auth-p">To keep connected with us please login with your personal info</p>
                <button type="button" className="auth-btn ghost" onClick={() => togglePanel(false)}>
                  Sign In
                </button>
              </div>

              {/* Right Overlay (shown when Sign In active) */}
              <div className="auth-overlay-panel auth-overlay-right">
                <h1 className="overlay-title">Hello, Friend!</h1>
                <p className="auth-p">Enter your personal details and start your journey with us</p>
                <button type="button" className="auth-btn ghost" onClick={() => togglePanel(true)}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;
`;

fs.writeFileSync('c:/Users/User/Desktop/MOS_Burger/mos_product_frontend/most_product_frontend/src/pages/Login.jsx', content);
console.log('Advanced Login.jsx written perfectly.');