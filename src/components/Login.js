import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const welcomeTexts = [
  "Welcome to R.B.A.C Dashboard",
  "Secure. Efficient. Powerful.",
  "Manage with Confidence"
];

function Login({ setIsLoggedIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % welcomeTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email === 'admin@example.com' && formData.password === 'admin123@') {
      setIsLoggedIn(true);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-800 p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-cyan-500/30 animate-gradient-xy"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-50"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Animated Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8 absolute top-[-120px] left-0 right-0"
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentTextIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {welcomeTexts[currentTextIndex]}
            </motion.h2>
          </AnimatePresence>
          <p className="text-white/80 text-sm">
            email: admin@example.com, password: admin123@
          </p>
        </motion.div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Welcome Back
            </h1>
            <p className="text-gray-200 mt-2">Sign in to your account</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative group">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 group-focus-within:text-purple-400 transition-colors duration-300" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative group">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 group-focus-within:text-purple-400 transition-colors duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white focus:outline-none transition-colors duration-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-400 text-center font-semibold"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(167, 139, 250, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg py-3 font-semibold shadow-lg hover:shadow-purple-500/30 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10">Sign In</span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <a href="/reset-password" className="text-white/80 hover:text-white transition-colors duration-300 underline underline-offset-2">
              Forgot Password?
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;

