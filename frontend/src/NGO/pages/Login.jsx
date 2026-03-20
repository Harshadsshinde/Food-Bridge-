import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // ✅ new import
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

// (Keep the TbTruckDelivery icon definition as before)

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext); // ✅ use login
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        { email, password, role: "NGO" },
        { withCredentials: true, timeout: 5000 }
      );

      if (response.data && response.data.user) {
        const { user, token } = response.data; // adjust if your API returns token differently
        login(user, token, 'ngo'); // ✅ set role as 'ngo'
        navigate('/ngo/dashboard'); // ✅ redirect to NGO dashboard
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      let errorMessage = 'Something went wrong';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-emerald-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-500 p-3 rounded-full">
              <TbTruckDelivery className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">FoodBridge</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium"
                placeholder="ngo@example.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button type="button" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "NGO Login"
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-600 font-medium">
              New NGO?{' '}
              <button 
                type="button"
                onClick={() => navigate("/ngo/signup")}
                className="text-emerald-600 font-bold hover:underline"
              >
                Register Here
              </button>
            </p>
          </div>
        </form>

        <div className="mt-12 text-center text-sm text-gray-500 font-medium">
          © {new Date().getFullYear()} FoodBridge. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
};

// Icon component (keep as is)
const TbTruckDelivery = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    ></path>
  </svg>
);

export default Login;