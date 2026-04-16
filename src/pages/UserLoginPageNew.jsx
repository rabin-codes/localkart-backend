import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../components';

export const UserLoginPageNew = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (isSignup && !formData.name) newErrors.name = 'Name is required';
    if (isSignup && !formData.phone) newErrors.phone = 'Phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <ShoppingBag className="text-white w-6 h-6" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">LocalKart</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">Fresh Groceries</p>
            <p className="text-gray-600 mb-8">Delivered to your doorstep in minutes</p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            {[
              { icon: '🚚', title: 'Fast Delivery', desc: 'Get fresh groceries in 30 minutes' },
              { icon: '🌱', title: 'Fresh Products', desc: 'Sourced from local farms daily' },
              { icon: '💰', title: 'Best Prices', desc: '20% cheaper than retail stores' },
              { icon: '✅', title: 'Quality Assured', desc: '100% fresh or money back guarantee' },
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-white/70 backdrop-blur rounded-lg hover:bg-white transition shadow-sm">
                <div className="text-3xl">{benefit.icon}</div>
                <div>
                  <p className="font-semibold text-gray-900">{benefit.title}</p>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center px-4 lg:px-8">
          <Card className="bg-white/95 backdrop-blur p-8 rounded-2xl shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isSignup ? '👋 Create Account' : '👋 Welcome Back'}
              </h2>
              <p className="text-gray-600">{isSignup ? 'Join fresh grocery shopping' : 'Sign in to your account'}</p>
            </div>

            {/* Alert */}
            {showAlert && !isSignup && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-blue-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 text-sm">Demo Credentials</p>
                  <p className="text-blue-800 text-sm">Email: demo@user.com | Pass: demo123</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-pulse">
                <CheckCircle className="text-green-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 text-sm">✓ {isSignup ? 'Account created successfully!' : 'Signed in successfully!'}</p>
                  <p className="text-green-800 text-sm">Redirecting...</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition`}
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>
              )}

              {isSignup && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition`}
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition`}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition`}
                />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? '🔄 Processing...' : isSignup ? '✓ Create Account' : '→ Sign In'}
              </button>
            </form>

            {/* Toggle Between Login/Signup */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm mb-4">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="ml-2 text-orange-600 font-semibold hover:text-orange-700 transition"
                >
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm mb-3">Login as different role?</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => navigate('/vendor-login')}
                    className="px-3 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition font-semibold"
                  >
                    Vendor
                  </button>
                  <button
                    onClick={() => navigate('/delivery-login')}
                    className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-semibold"
                  >
                    Delivery Partner
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPageNew;
