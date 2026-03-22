import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, ArrowLeft, Send, CheckCircle, Lock, Eye, EyeOff,
  Key, Leaf, Sprout, Sun, ShieldCheck, LogIn
} from 'lucide-react';
import { authService } from '../../services/authService';
import CustomAuthAlert from './CustomAuthAlert';
import AgriBackground from './AgriBackground';
import '../../styles/auth.css';

const AuthForgotReset = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const isPasswordReset = !!token;

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  // Password validation
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return {
      minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(formData.newPassword);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ─── Forgot Password Submit ─────────────────────────────────
  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setAlert({ isOpen: true, type: 'error', title: 'Action Required', message: 'Please enter your email address.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({ isOpen: true, type: 'error', title: 'Invalid Email', message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setEmailSent(true);
      setAlert({ isOpen: true, type: 'success', title: 'Email Sent', message: 'Reset link sent! Check your inbox.' });
    } catch (error) {
      let errorMessage = 'Failed to send reset email. Please try again.';
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.response?.status === 404) errorMessage = 'Email address not found.';
      else if (error.response?.status === 429) errorMessage = 'Too many requests. Please wait.';
      
      setAlert({ isOpen: true, type: 'error', title: 'Reset Failed', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // ─── Reset Password Submit ──────────────────────────────────
  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword) {
      setAlert({ isOpen: true, type: 'error', title: 'Action Required', message: 'Please enter a new password.' });
      return;
    }
    if (!formData.confirmPassword) {
      setAlert({ isOpen: true, type: 'error', title: 'Action Required', message: 'Please confirm your new password.' });
      return;
    }
    if (!passwordValidation.isValid) {
      setAlert({ isOpen: true, type: 'error', title: 'Invalid Password', message: 'Password does not meet all requirements.' });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setAlert({ isOpen: true, type: 'error', title: 'Password Mismatch', message: 'Passwords do not match.' });
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, formData.newPassword);
      setResetSuccess(true);
      setAlert({ isOpen: true, type: 'success', title: 'Success!', message: 'Password reset successfully!' });
    } catch (error) {
      let errorMessage = 'Failed to reset password. Please try again.';
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.response?.status === 400) errorMessage = 'Invalid or expired reset token.';
      
      setAlert({ isOpen: true, type: 'error', title: 'Reset Failed', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // ─── Animation Variants ───────────────────────────────────────
  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const contentVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.25 } }
  };

  const inputClass = "auth-input block w-full pl-11 pr-11 py-3 rounded-xl text-emerald-950 font-bold text-sm outline-none";

  // ─── Password Requirement Row ──────────────────────────────
  const ReqRow = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors ${met ? 'text-green-300' : 'text-white/40'}`}>
      <CheckCircle className={`w-3.5 h-3.5 ${met ? 'text-green-400' : 'text-white/20'}`} />
      {text}
    </div>
  );

  // ─── Render ───────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <AgriBackground />

      <div className="auth-content-layer w-full max-w-md mx-auto px-4 py-8">
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          {/* Floating Icons */}
          <div className="relative">
            <Leaf className="auth-float-icon-1 absolute -top-8 -left-4 w-6 h-6 text-green-400/30" />
            <Sprout className="auth-float-icon-2 absolute -top-6 -right-6 w-7 h-7 text-emerald-400/25" />
            <Sun className="auth-float-icon-3 absolute -top-10 left-1/2 w-5 h-5 text-yellow-400/25" />
          </div>

          <div className="auth-glass-card rounded-2xl p-8 sm:p-10">
            {/* Branding */}
            <div className="text-center mb-6">
              <div className="auth-leaf-pulse relative inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/30 rounded-[1.25rem] mb-4 shadow-2xl shadow-green-900/10 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:rounded-[1.25rem] before:pointer-events-none">
                <img src="/logo.png" alt="AgroSmart Logo" className="w-12 h-12 object-contain relative z-10 drop-shadow-md" />
              </div>
              <h1 className="auth-brand-shimmer text-3xl font-extrabold tracking-tight">
                AgroSmart
              </h1>
              <p className="text-emerald-900 text-sm mt-1 font-bold">
                Empowering Smart Agriculture 🌱
              </p>
            </div>

            <AnimatePresence mode="wait">
              {/* ── Success Screen (Reset Complete) ── */}
              {resetSuccess && (
                <motion.div
                  key="reset-success"
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="text-center"
                >
                  <div className="auth-check-animate w-16 h-16 bg-green-500/20 border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-5">
                    <ShieldCheck className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-xl font-extrabold text-emerald-950 mb-3">Password Reset Successful!</h2>
                  <p className="text-emerald-900 font-bold text-sm mb-6">
                    Your password has been updated. You can now login with your new password.
                  </p>
                  <Link
                    to="/login"
                    className="auth-btn-glow inline-flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-emerald-800 to-green-950 text-white font-semibold rounded-xl gap-2 text-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    Continue to Login
                  </Link>
                </motion.div>
              )}

              {/* ── Email Sent Confirmation ── */}
              {emailSent && !resetSuccess && (
                <motion.div
                  key="email-sent"
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="text-center"
                >
                  <div className="auth-check-animate w-16 h-16 bg-green-500/20 border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-xl font-extrabold text-emerald-950 mb-3">Check Your Email</h2>
                  <p className="text-emerald-950 font-medium text-sm mb-4">
                    We've sent a reset link to <strong className="font-bold">{email}</strong>
                  </p>
                  <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 mb-6">
                    <p className="text-xs text-blue-900 font-medium">
                      <strong>Important:</strong> The reset link will expire in 15 minutes. Check your spam folder if you don't see the email.
                    </p>
                  </div>
                  <button
                    onClick={() => { setEmailSent(false); setEmail(''); }}
                    className="inline-flex items-center justify-center w-full py-3 border border-emerald-900/20 text-emerald-900 hover:text-emerald-950 hover:border-emerald-900/40 rounded-xl transition-all text-sm font-bold gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Try Another Email
                  </button>
                  <div className="mt-4">
                    <Link to="/login" className="text-emerald-700 hover:text-emerald-900 font-bold text-sm transition-colors">
                      ← Back to Login
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* ── Forgot Password Form ── */}
              {!isPasswordReset && !emailSent && !resetSuccess && (
                <motion.div
                  key="forgot-form"
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-amber-100 border border-amber-300 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Mail className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-extrabold text-emerald-950">Forgot Password?</h2>
                    <p className="text-emerald-950 font-medium text-sm mt-1">
                      Enter your email and we'll send you a reset link.
                    </p>
                  </div>

                  <form onSubmit={handleForgotSubmit} noValidate className="space-y-5">
                    <div>
                      <label htmlFor="forgot-email" className="block text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900 pointer-events-none" />
                        <input
                          id="forgot-email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={inputClass}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

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
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Reset Link
                        </>
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-6 flex items-center justify-between text-sm">
                    <Link to="/login" className="text-emerald-700 hover:text-emerald-900 font-bold transition-colors flex items-center gap-1">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                    </Link>
                    <Link to="/register" className="text-emerald-700 hover:text-emerald-900 font-bold transition-colors">
                      Sign up
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* ── Reset Password Form (with token) ── */}
              {isPasswordReset && !resetSuccess && (
                <motion.div
                  key="reset-form"
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 border border-blue-300 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                      <Key className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-extrabold text-emerald-950">Reset Your Password</h2>
                    <p className="text-emerald-950 font-medium text-sm mt-1">
                      Enter your new password below.
                    </p>
                  </div>

                  <form onSubmit={handleResetSubmit} noValidate className="space-y-5">
                    {/* New Password */}
                    <div>
                      <label htmlFor="newPassword" className="block text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900 pointer-events-none" />
                        <input
                          id="newPassword"
                          name="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={formData.newPassword}
                          onChange={handlePasswordChange}
                          className={inputClass}
                          placeholder="Enter new password"
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

                    {/* Confirm Password */}
                    <div>
                      <label htmlFor="resetConfirmPassword" className="block text-emerald-950 text-xs font-semibold uppercase tracking-wider mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-900 pointer-events-none" />
                        <input
                          id="resetConfirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={formData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={inputClass}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-emerald-700 transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Password Requirements */}
                    {formData.newPassword && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1.5"
                      >
                        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Requirements</p>
                        <ReqRow met={passwordValidation.minLength} text="At least 8 characters" />
                        <ReqRow met={passwordValidation.hasUpperCase} text="One uppercase letter" />
                        <ReqRow met={passwordValidation.hasLowerCase} text="One lowercase letter" />
                        <ReqRow met={passwordValidation.hasNumbers} text="One number" />
                        <ReqRow met={passwordValidation.hasSpecialChar} text="One special character" />
                      </motion.div>
                    )}

                    {/* Match indicator */}
                    {formData.confirmPassword && (
                      <div className={`text-xs font-medium ${formData.newPassword === formData.confirmPassword ? 'text-green-300' : 'text-red-300'}`}>
                        {formData.newPassword === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading || !passwordValidation.isValid || formData.newPassword !== formData.confirmPassword}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="auth-btn-glow w-full py-3.5 bg-gradient-to-r from-emerald-800 to-green-950 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          Reset Password
                        </>
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link to="/login" className="text-emerald-700 hover:text-emerald-900 font-bold text-sm transition-colors flex items-center justify-center gap-1">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
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

export default AuthForgotReset;
