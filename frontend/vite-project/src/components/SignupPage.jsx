import { useState } from 'react';
import { Mail, Lock, User, MapPin, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/authService';
import './AuthPages.css';

export default function SignupPage() {
   const [formData, setFormData] = useState({
      name: '',
      address: '',
      email: '',
      password: '',
      confirmPassword: '',
   });
   const [captcha, setCaptcha] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [errors, setErrors] = useState({});
   const [captchaCode, setCaptchaCode] = useState('');

   // Generate simple captcha
   const generateCaptcha = () => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCaptchaCode(code);
      setCaptcha('');
   };

   const validateForm = () => {
      const newErrors = {};

      if (!formData.name.trim()) {
         newErrors.name = 'Name is required';
      } else if (formData.name.length < 2) {
         newErrors.name = 'Name must be at least 2 characters';
      }

      if (!formData.address.trim()) {
         newErrors.address = 'Address is required';
      }

      if (!formData.email.trim()) {
         newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
         newErrors.email = 'Please enter a valid email';
      }

      if (!formData.password) {
         newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
         newErrors.password = 'Password must be at least 6 characters';
      }

      if (!formData.confirmPassword) {
         newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!captcha.trim()) {
         newErrors.captcha = 'Please enter the captcha';
      } else if (captcha.toUpperCase() !== captchaCode) {
         newErrors.captcha = 'Captcha is incorrect';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      setIsLoading(true);
      try {
         const response = await authAPI.signup(
            formData.name,
            formData.address,
            formData.email,
            formData.password
         );

         if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            alert('Account created successfully!');
            setFormData({
               name: '',
               address: '',
               email: '',
               password: '',
               confirmPassword: '',
            });
            setCaptcha('');
            // Redirect to dashboard or home page
            window.location.href = '/dashboard';
         }
      } catch (error) {
         const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Signup failed. Please try again.';
         setErrors({ submit: errorMsg });
      } finally {
         setIsLoading(false);
      }
   };

   // Generate captcha on component mount
   if (!captchaCode) {
      generateCaptcha();
   }

   return (
      <div className="auth-container">
         <div className="auth-card auth-card-large">
            <h2 className="auth-title">Sign Up</h2>

            <form onSubmit={handleSubmit} className="auth-form">
               {errors.submit && <div className="submit-error">{errors.submit}</div>}
               {/* Name */}
               <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                     <User size={18} className="input-icon" />
                     <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`form-input ${errors.name ? 'error' : ''}`}
                     />
                  </div>
                  {errors.name && <span className="error-message">{errors.name}</span>}
               </div>

               {/* Address */}
               <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <div className="input-wrapper">
                     <MapPin size={18} className="input-icon" />
                     <input
                        id="address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        className={`form-input ${errors.address ? 'error' : ''}`}
                     />
                  </div>
                  {errors.address && <span className="error-message">{errors.address}</span>}
               </div>

               {/* Email */}
               <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-wrapper">
                     <Mail size={18} className="input-icon" />
                     <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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

               {/* Confirm Password */}
               <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                     <Lock size={18} className="input-icon" />
                     <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                     />
                     <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="toggle-password"
                     >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                  </div>
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
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
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
               </button>
            </form>

            <div className="auth-footer">
               <p>Already have an account? <a href="/login">Login here</a></p>
            </div>
         </div>
      </div>
   );
}
