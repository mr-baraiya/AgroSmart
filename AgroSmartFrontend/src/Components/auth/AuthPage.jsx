import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  User, Mail, Lock, Phone, MapPin, Eye, EyeOff,
  LogIn, UserPlus, AlertCircle, Leaf, Sprout, Sun
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthProvider';
import CustomAuthAlert from './CustomAuthAlert';
import AgriBackground from './AgriBackground';
import '../../styles/auth.css';

gsap.registerPlugin(useGSAP);

const AuthPage = ({ defaultMode = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const containerRef = useRef(null);
  const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  useGSAP(() => {
    // Elegant staggered entrance
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.auth-glass-card', {
      y: 60,
      opacity: 0,
      duration: 1,
      clearProps: 'all'
    })
    .from('.gsap-stagger-item', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.5)',
      clearProps: 'all'
    }, "-=0.6");
  }, { scope: containerRef });

  const [mode, setMode] = useState(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Login form data
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
    role: 'User'
  });

  // Register form data
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    passwordHash: '',
    confirmPassword: '',
    role: 'User',
    phone: '',
    address: '',
    isActive: true
  });

  // Sync mode from route
  useEffect(() => {
    setMode(defaultMode);
  }, [defaultMode]);

  // Clear errors on mode switch
  useEffect(() => {
    setError('');
    setValidationErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [mode]);

  const from = location.state?.from?.pathname;

  // ─── Login Handlers ───────────────────────────────────────────
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.identifier || !loginData.password || !loginData.role) {
      setAlert({ isOpen: true, type: 'error', title: 'Action Required', message: 'Please fill in all fields.' });
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await login(loginData);

      if (response.role === 'Admin') {
        navigate('/dashboard', { replace: true });
      } else if (response.role === 'User') {
        navigate('/user-dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

      setAlert({ isOpen: true, type: 'success', title: 'Welcome Back!', message: 'You have successfully logged in.' });
    } catch (err) {
      console.error('Login error:', err);

      if (err.isInactive) {
        setAlert({ isOpen: true, type: 'error', title: 'Account Inactive', message: 'Your account is inactive. Please contact admin to activate your profile.' });
        setTimeout(() => {
          navigate('/contact', {
            state: {
              reason: 'account_inactive',
              userEmail: err.userData?.email,
              userName: err.userData?.name
            }
          });
        }, 2000);
        setError('Your account is inactive. Please contact admin to activate your profile.');
        return;
      }

      let errorMessage = 'Login failed. Please try again.';
      if (err.response?.status === 401) {
        errorMessage = 'Invalid email/username, password, or role';
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || 'Invalid login credentials';
      }
      setAlert({ isOpen: true, type: 'error', title: 'Login Failed', message: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ─── Register Handlers ────────────────────────────────────────
  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateRegister = () => {
    const errors = {};
    if (!registerData.fullName.trim()) errors.fullName = 'Full name is required';
    else if (registerData.fullName.trim().length < 2) errors.fullName = 'Must be at least 2 characters';

    if (!registerData.email.trim()) errors.email = 'Email is required';
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(registerData.email.trim()))
      errors.email = 'Please enter a valid email address';

    if (!registerData.passwordHash) errors.passwordHash = 'Password is required';
    else if (registerData.passwordHash.length < 6) errors.passwordHash = 'Password must be at least 6 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerData.passwordHash))
      errors.passwordHash = 'Must contain uppercase, lowercase, and digit';

    if (!registerData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (registerData.passwordHash !== registerData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (!registerData.phone.trim()) errors.phone = 'Phone number is required';
    else {
      const cleanPhone = registerData.phone.replace(/\D/g, '');
      if (cleanPhone.length !== 10) errors.phone = 'Phone must be a 10-digit number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!validateRegister()) {
      const firstError = Object.values(validationErrors)[0];
      setAlert({ isOpen: true, type: 'error', title: 'Validation Error', message: firstError || 'Please fill in all required fields correctly.' });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = {
        fullName: registerData.fullName.trim(),
        email: registerData.email.trim().toLowerCase(),
        passwordHash: registerData.passwordHash,
        role: 'User',
        phone: registerData.phone.replace(/\D/g, ''),
        address: registerData.address.trim() || '',
        isActive: true
      };

      await register(data);
      setAlert({ isOpen: true, type: 'success', title: 'Registration Successful', message: 'Your account was created. Please log in.' });
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration failed. Please try again.';

      if (err.response?.status === 409) {
        errorMessage = 'An account with this email already exists';
      } else if (err.response?.status === 400 && err.response.data?.errors) {
        const backendErrors = err.response.data.errors;
        const errorMessages = [];
        Object.keys(backendErrors).forEach(field => {
          if (Array.isArray(backendErrors[field])) errorMessages.push(...backendErrors[field]);
        });
        errorMessage = errorMessages.length > 0 ? errorMessages.join('; ') : 'Invalid registration data';
      } else if (err.response?.status === 400) {
        errorMessage = err.response?.data?.message || err.response?.data?.title || 'Registration failed.';
      }
      setAlert({ isOpen: true, type: 'error', title: 'Registration Failed', message: errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ─── Animation Variants ───────────────────────────────────────


  const formVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.25, ease: 'easeIn' } }
  };

  const inputFieldClass = (fieldName) =>
    `auth-input block w-full pl-11 pr-11 py-3 rounded-xl text-emerald-950 font-bold text-sm outline-none ${
      validationErrors[fieldName] ? 'border-red-400/60' : ''
    }`;

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <AgriBackground />

      {/* Content Layer */}
      <div className={`auth-content-layer w-full mx-auto px-4 py-8 transition-all duration-500 ${mode === 'register' ? 'max-w-2xl' : 'max-w-md'}`}>
        <div ref={containerRef}>
          {/* Floating decorative icons */}
          <div className="relative">
            <Leaf className="auth-float-icon-1 absolute -top-8 -left-4 w-6 h-6 text-green-400/30" />
            <Sprout className="auth-float-icon-2 absolute -top-6 -right-6 w-7 h-7 text-emerald-400/25" />
            <Sun className="auth-float-icon-3 absolute -top-10 left-1/2 w-5 h-5 text-yellow-400/25" />
          </div>

          {/* Main Glass Card */}
          <div className="auth-glass-card rounded-2xl p-8 sm:p-10">
            {/* Branding */}
            <div className="text-center mb-6">
              <div className="gsap-stagger-item auth-leaf-pulse relative inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/30 rounded-[1.25rem] mb-4 shadow-2xl shadow-green-900/10 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:rounded-[1.25rem] before:pointer-events-none">
                <img src="/logo.png" alt="AgroSmart Logo" className="w-12 h-12 object-contain relative z-10 drop-shadow-md" />
              </div>
              <h1 className="gsap-stagger-item auth-brand-shimmer text-3xl font-extrabold tracking-tight">
                AgroSmart
              </h1>
              <p className="gsap-stagger-item text-emerald-900 text-sm mt-1 font-bold">
                Empowering Smart Agriculture 🌱
              </p>
            </div>

            {/* Tab Toggle */}
            <div className="gsap-stagger-item auth-tab-bg rounded-xl p-1 flex mb-7">
              <button
                onClick={() => { setMode('login'); navigate('/login', { replace: true }); }}
                className={`relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  mode === 'login'
                    ? 'auth-tab-active text-white'
                    : 'text-emerald-950/60 hover:text-emerald-950'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <LogIn className="w-4 h-4" /> Sign In
                </span>
              </button>
              <button
                onClick={() => { setMode('register'); navigate('/register', { replace: true }); }}
                className={`relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  mode === 'register'
                    ? 'auth-tab-active text-white'
                    : 'text-emerald-950/60 hover:text-emerald-950'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5">
                  <UserPlus className="w-4 h-4" /> Sign Up
                </span>
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="auth-error-box px-4 py-3 rounded-xl flex items-center gap-2 mb-5"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span className="text-sm font-bold tracking-wide uppercase">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message (from registration redirect) */}
            {location.state?.message && (
              <div className="auth-success-box px-4 py-3 rounded-xl mb-5">
                <span className="text-sm font-bold tracking-wide uppercase">{location.state.message}</span>
              </div>
            )}

            {/* Forms */}
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.form
                  key="login"
                  variants={formVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  onSubmit={handleLoginSubmit}
                  noValidate
                  className="space-y-5"
                >
                  {/* Role Selection (Segmented Toggle) */}
                  <div>
                    <label className="block text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-2">
                      Login as
                    </label>
                    <div className="inline-flex p-1 bg-black/10 border border-white/10 rounded-lg">
                      {['User', 'Admin'].map(role => {
                        const isSelected = loginData.role === role;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleLoginChange({ target: { name: 'role', value: role } })}
                            className={`relative px-6 py-1.5 text-xs font-bold rounded-md transition-colors z-10 ${
                              isSelected ? 'text-emerald-950' : 'text-white/50 hover:text-white/80'
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="role-indicator"
                                className="absolute inset-0 bg-white shadow-sm rounded-md -z-10"
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                              />
                            )}
                            {role}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Email/Username */}
                  <div>
                    <label htmlFor="identifier" className="block text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-2">
                      Email or Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900 pointer-events-none" />
                      <input
                        id="identifier"
                        name="identifier"
                        type="text"
                        autoComplete="username"
                        value={loginData.identifier}
                        onChange={handleLoginChange}
                        className={inputFieldClass()}
                        placeholder="Enter your email or username"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="login-password" className="block text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900 pointer-events-none" />
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className={inputFieldClass()}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-emerald-700 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded bg-white/10 border-white/30 text-green-500 focus:ring-green-500 focus:ring-offset-0"
                      />
                      <span className="text-white/60 text-sm">Remember me</span>
                    </label>
                    <Link
                      to="/auth/forgot-password"
                      className="text-emerald-700 hover:text-emerald-900 font-bold text-sm font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="auth-btn-glow w-full py-3.5 bg-gradient-to-r from-emerald-800 to-green-950 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        Sign In
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  variants={formVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  onSubmit={handleRegisterSubmit}
                  noValidate
                >
                  {/* 2-column grid — stacks on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900 pointer-events-none" />
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          autoComplete="name"
                          value={registerData.fullName}
                          onChange={handleRegisterChange}
                          className={inputFieldClass('fullName')}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {validationErrors.fullName && (
                        <p className="mt-1 text-xs text-red-300">{validationErrors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="reg-email" className="block text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900 pointer-events-none" />
                        <input
                          id="reg-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          className={inputFieldClass('email')}
                          placeholder="Enter your email"
                        />
                      </div>
                      {validationErrors.email && (
                        <p className="mt-1 text-xs text-red-300">{validationErrors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label htmlFor="reg-password" className="block text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900 pointer-events-none" />
                        <input
                          id="reg-password"
                          name="passwordHash"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={registerData.passwordHash}
                          onChange={handleRegisterChange}
                          className={inputFieldClass('passwordHash')}
                          placeholder="Create a password"
                        />
                        <button
                          type="button"
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-emerald-700 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {validationErrors.passwordHash && (
                        <p className="mt-1 text-xs text-red-300">{validationErrors.passwordHash}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900 pointer-events-none" />
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          className={inputFieldClass('confirmPassword')}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-emerald-700 transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {validationErrors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-300">{validationErrors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900 pointer-events-none" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          value={registerData.phone}
                          onChange={handleRegisterChange}
                          className={inputFieldClass('phone')}
                          placeholder="10-digit phone number"
                        />
                      </div>
                      {validationErrors.phone && (
                        <p className="mt-1 text-xs text-red-300">{validationErrors.phone}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label htmlFor="address" className="block text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-2">
                        Address (Optional)
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900 pointer-events-none" />
                        <input
                          id="address"
                          name="address"
                          type="text"
                          autoComplete="street-address"
                          value={registerData.address}
                          onChange={handleRegisterChange}
                          className="auth-input block w-full pl-11 pr-4 py-3 rounded-xl text-gray-800 text-sm font-medium outline-none"
                          placeholder="Enter your address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit — full width below the grid */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="auth-btn-glow w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-800 to-green-950 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Create Account
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Bottom link */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-white/40 hover:text-white/60 text-sm transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CustomAuthAlert 
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default AuthPage;
