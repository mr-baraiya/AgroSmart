import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, Lock, Eye, EyeOff, Key } from 'lucide-react';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  // Add custom CSS for SweetAlert2 button hover effects
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .swal2-confirm-hover {
        background-color: #ef4444 !important;
        border: none !important;
        border-radius: 0.5rem !important;
        padding: 0.75rem 1.5rem !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
      }
      .swal2-confirm-hover:hover {
        background-color: #dc2626 !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }
      .swal2-success-confirm {
        background-color: #10b981 !important;
        border: none !important;
        border-radius: 0.5rem !important;
        padding: 0.75rem 1.5rem !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
        color: white !important;
      }
      .swal2-success-confirm:hover {
        background-color: #059669 !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      .swal2-popup {
        border-radius: 1rem !important;
      }
      .swal2-title {
        font-size: 1.25rem !important;
        font-weight: 600 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetData, setResetData] = useState(null);
  
  // Password reset form state
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // If token exists, this is a password reset, not forgot password
  const isPasswordReset = !!token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        customClass: {
          confirmButton: 'swal2-confirm-hover'
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authService.requestPasswordReset(email);
      
      setResetData(response);
      setEmailSent(true);
      
      Swal.fire({
        icon: 'success',
        title: 'Reset Link Sent!',
        text: 'Check your email for the password reset link.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
        customClass: {
          confirmButton: 'swal2-success-confirm'
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      
    } catch (error) {
      console.error('Password reset request failed:', error);
      
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Email address not found. Please check and try again.';
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
        text: errorMessage,
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        customClass: {
          confirmButton: 'swal2-confirm-hover'
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setEmailSent(false);
    setEmail('');
    setResetData(null);
  };

  // Password validation function
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(formData.newPassword);

  // Handle password reset form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password reset submission
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    // Check for empty fields
    if (!formData.newPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Required',
        text: 'Please enter a new password.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        customClass: {
          confirmButton: 'swal2-confirm-hover'
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    if (!formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Confirmation Required',
        text: 'Please confirm your new password.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        customClass: {
          confirmButton: 'swal2-confirm-hover'
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }
    
    if (!passwordValidation.isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Password',
        text: 'Please ensure your password meets all requirements.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        customClass: {
          confirmButton: 'swal2-confirm-hover'
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords Don\'t Match',
        text: 'Please ensure both passwords are identical.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        customClass: {
          confirmButton: 'swal2-confirm-hover'
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(token, formData.newPassword);

      setResetSuccess(true);
      
      Swal.fire({
        icon: 'success',
        title: 'Password Reset Successful!',
        text: 'Your password has been updated. You can now login with your new password.',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#10b981',
        customClass: {
          confirmButton: 'swal2-success-confirm'
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });

    } catch (error) {
      console.error('Password reset failed:', error);
      
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid or expired reset token. Please request a new reset link.';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
        text: errorMessage,
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        customClass: {
          confirmButton: 'swal2-confirm-hover'
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Success screen for password reset
  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Password Reset Successful!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Your password has been successfully updated. You can now login with your new password.
            </p>
            
            <Link
              to="/auth/login"
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Continue to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> The reset link will expire in 15 minutes. 
                If you don't see the email, check your spam folder.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleBackToLogin}
                className="w-full flex items-center justify-center px-6 py-3 border-2 border-green-500 rounded-lg text-green-700 bg-white hover:bg-green-50 hover:border-green-600 hover:text-green-800 hover:shadow-md transition-all duration-200 font-medium group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-200" />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!isPasswordReset ? (
            // Forgot Password Form (Request reset email)
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Forgot Password?
                </h2>
                <p className="text-gray-600 mt-2">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="text"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/auth/login"
                  className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Link>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/auth/register"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </>
          ) : (
            // Password Reset Form (Change password with token)
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Reset Your Password
                </h2>
                <p className="text-gray-600 mt-2">
                  Enter your new password below. Make sure it's strong and secure.
                </p>
              </div>

              <form onSubmit={handlePasswordReset} className="space-y-6" noValidate>
                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                {formData.newPassword && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                    <div className="space-y-1">
                      <div className={`flex items-center text-sm ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                        <CheckCircle className={`w-4 h-4 mr-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-400'}`} />
                        At least 8 characters
                      </div>
                      <div className={`flex items-center text-sm ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                        <CheckCircle className={`w-4 h-4 mr-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`} />
                        One uppercase letter
                      </div>
                      <div className={`flex items-center text-sm ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                        <CheckCircle className={`w-4 h-4 mr-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`} />
                        One lowercase letter
                      </div>
                      <div className={`flex items-center text-sm ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-gray-500'}`}>
                        <CheckCircle className={`w-4 h-4 mr-2 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-gray-400'}`} />
                        One number
                      </div>
                      <div className={`flex items-center text-sm ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                        <CheckCircle className={`w-4 h-4 mr-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`} />
                        One special character
                      </div>
                    </div>
                  </div>
                )}

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className={`text-sm ${formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                    {formData.newPassword === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !passwordValidation.isValid || formData.newPassword !== formData.confirmPassword}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/auth/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
