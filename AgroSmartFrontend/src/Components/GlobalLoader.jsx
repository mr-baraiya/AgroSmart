import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalLoader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = prevPath.current;
    
    const seamlessRoutes = ['/login', '/register', '/auth/login', '/auth/register'];
    const goingToAuth = seamlessRoutes.includes(currentPath);
    const comingFromAuth = seamlessRoutes.includes(previousPath);

    // If we're moving between Login and Register, keep it seamless.
    // If ANY other route is involved (like Forgot Password or Dashboard), show the loader.
    if (goingToAuth && comingFromAuth && currentPath !== previousPath) {
      prevPath.current = currentPath;
      return; 
    }
    
    prevPath.current = currentPath;

    // Otherwise, show loader on typical route change (like navigating to dashboard or homepage)
    setLoading(true);
    
    // Hide it after a short delay to allow background assets (like Three.js canvas) to compile
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // 800ms gives enough time for WebGL and heavy components to mount off-screen
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="global-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
          className="fixed inset-0 z-[99999] bg-gradient-to-br from-[#064e3b] to-[#022c22] flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Pulsing Glass Logo Container */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[1.25rem] border border-white/20 shadow-2xl shadow-black/50 flex items-center justify-center p-4 mb-8"
          >
            <img 
              src="/logo.png" 
              alt="Loading AgroSmart..." 
              className="w-16 h-16 object-contain drop-shadow-xl" 
            />
          </motion.div>
          
          {/* Brand Text */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white text-2xl font-bold tracking-[0.2em] uppercase mb-8 drop-shadow-lg"
          >
            AgroSmart
          </motion.h2>

          {/* Loading Bar */}
          <div className="w-64 h-1.5 bg-black/40 rounded-full overflow-hidden relative shadow-inner">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear"
              }}
              className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.8)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
