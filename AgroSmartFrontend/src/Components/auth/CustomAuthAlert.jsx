import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const CustomAuthAlert = ({ isOpen, type, title, message, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      if (type === 'success') {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, type, onClose]);

  const config = {
    success: {
      icon: <CheckCircle className="w-10 h-10 text-emerald-400" />,
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-500/30',
      glow: 'shadow-[0_0_40px_rgba(16,185,129,0.15)]',
      btnText: 'Continue'
    },
    error: {
      icon: <AlertCircle className="w-10 h-10 text-red-400" />,
      bg: 'bg-red-950/80',
      border: 'border-red-500/30',
      glow: 'shadow-[0_0_40px_rgba(239,68,68,0.15)]',
      btnText: 'Try Again'
    },
    info: {
      icon: <Info className="w-10 h-10 text-blue-400" />,
      bg: 'bg-blue-950/80',
      border: 'border-blue-500/30',
      glow: 'shadow-[0_0_40px_rgba(59,130,246,0.15)]',
      btnText: 'OK'
    }
  };

  const currentTheme = config[type] || config.info;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="custom-alert-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`relative w-full max-w-sm p-8 rounded-[1.5rem] backdrop-blur-xl border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.glow} shadow-2xl overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Auto-Close Progress Bar for Success */}
            {type === 'success' && (
               <motion.div
                 initial={{ width: '100%' }}
                 animate={{ width: '0%' }}
                 transition={{ duration: 3, ease: 'linear' }}
                 className="absolute bottom-0 left-0 h-1 bg-emerald-500/50"
               />
            )}

            <button 
              onClick={onClose}
              className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-5 bg-white/5 p-4 rounded-full border border-white/10 shadow-inner">
                {currentTheme.icon}
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2 tracking-wide">
                {title}
              </h3>
              <p className="text-white/80 text-sm font-medium leading-relaxed mb-6">
                {message}
              </p>
              
              <button
                onClick={onClose}
                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                {currentTheme.btnText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomAuthAlert;
