import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/authService';
import './AuthPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');

  // Generate simple captcha
  const generateCaptcha = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCaptchaCode(code);
    setCaptcha('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!captcha.trim()) {
      newErrors.captcha = 'Please enter the captcha';
    } else if (captcha.toUpperCase() !== captchaCode) {
      newErrors.captcha = 'Captcha is incorrect';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        alert('Login successful!');
        setEmail('');
        setPassword('');
        setCaptcha('');
        // Redirect to dashboard or home page
        window.location.href = '/dashboard';
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ submit: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate captcha on component mount and reload button click
  if (!captchaCode) {
    generateCaptcha();
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.submit && <div className="submit-error">{errors.submit}</div>}
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`form-input ${errors.password ? 'error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Captcha */}
          <div className="form-group">
            <label htmlFor="captcha">Captcha</label>
            <div className="captcha-container">
              <div className="captcha-image">
                {captchaCode && (
                  <span className="captcha-text">{captchaCode}</span>
                )}
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                className="captcha-reload"
              >
                ↻
              </button>
            </div>
            <input
              id="captcha"
              type="text"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              placeholder="Enter the text above"
              className={`form-input ${errors.captcha ? 'error' : ''}`}
            />
            {errors.captcha && <span className="error-message">{errors.captcha}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-submit"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <a href="/signup">Sign up here</a></p>
        </div>
      </div>
    </div>
  );
}
