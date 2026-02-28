import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Leaf,
  Sparkles,
  Cloud,
  TrendingUp,
  Star,
  Mail,
  Zap,
  Smartphone,
  QrCode,
  BookOpen
} from 'lucide-react';

const Header = ({ showQRCode = false, onShowQRCode = null, isDesktop = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { to: "/features", label: "Features", icon: <Sparkles className="w-4 h-4" /> },
    { to: "/weather", label: "Weather", icon: <Cloud className="w-4 h-4" /> },
    { to: "/mandi-prices", label: "Mandi Prices", icon: <TrendingUp className="w-4 h-4" /> },
    { to: "/learn-more", label: "Learn More", icon: <BookOpen className="w-4 h-4" /> },
    { to: "/about", label: "About", icon: <Star className="w-4 h-4" /> },
    { to: "/contact", label: "Contact", icon: <Mail className="w-4 h-4" /> }
  ];

  const isActive = (path) => {
    if (path.startsWith('#')) {
      return false; // Handle scroll links separately
    }
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Leaf className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AgroSmart
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.label}>
                {item.href ? (
                  <a 
                    href={item.href} 
                    className="text-gray-700 hover:text-green-600 transition-colors duration-200 relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </a>
                ) : (
                  <Link 
                    to={item.to} 
                    className={`text-gray-700 hover:text-green-600 transition-colors duration-200 relative group ${
                      isActive(item.to) ? 'text-green-600' : ''
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600 transition-all duration-300 ${
                      isActive(item.to) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </Link>
                )}
              </div>
            ))}
            
            {/* QR Code button - only show on desktop if enabled */}
            {/* Removed Mobile button */}
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/auth/login" 
                className="text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link 
                to="/auth/register" 
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t border-gray-100"
            >
              <div className="flex flex-col space-y-4">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.href ? (
                      <a 
                        href={item.href} 
                        className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <Link 
                        to={item.to} 
                        className={`flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200 ${
                          isActive(item.to) ? 'text-green-600' : ''
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </motion.div>
                ))}
                
                {/* Mobile Auth Buttons */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col space-y-2 pt-4 border-t border-gray-100"
                >
                  <Link 
                    to="/auth/login" 
                    className="text-center text-gray-700 hover:text-green-600 transition-colors duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/auth/register" 
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200 text-center flex items-center justify-center space-x-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Get Started</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Header;