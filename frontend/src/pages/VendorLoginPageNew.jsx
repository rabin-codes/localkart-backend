// src/pages/VendorLoginPageNew.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, AlertCircle, CheckCircle, TrendingUp, BarChart, Users } from 'lucide-react';
import { Card } from '../components';
import { authApi, setStoredAuthToken } from '../utils/api';

export const VendorLoginPageNew = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    shopName: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (isSignup && !formData.shopName) newErrors.shopName = 'Shop name is required';
    if (isSignup && !formData.phone) newErrors.phone = 'Phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = isSignup 
        ? await authApi.signupVendor({
            email: formData.email,
            password: formData.password,
            shopName: formData.shopName,
            phone: formData.phone
          })
        : await authApi.login({
            email: formData.email,
            password: formData.password
          });

      const token = response?.token || response?.data?.token;
      if (token) {
        setStoredAuthToken(token);
        localStorage.setItem('userRole', 'VENDOR');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/vendor-dashboard');
      }, 1500);

    } catch (error) {
      setErrors({ form: error.message || "Failed to authenticate." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <Store className="text-white w-6 h-6" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                LocalKart Business
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">Grow Your Business</p>
            <p className="text-gray-600 mb-8">Reach thousands of local customers digitally.</p>
          </div>

          <div className="space-y-4">
            {[
              { icon: <TrendingUp className="text-emerald-500 w-8 h-8" />, title: 'Increase Sales', desc: 'Access a larger customer base instantly' },
              { icon: <BarChart className="text-teal-500 w-8 h-8" />, title: 'Smart Dashboard', desc: 'Track inventory and daily earnings' },
              { icon: <Users className="text-emerald-600 w-8 h-8" />, title: 'Easy Management', desc: 'Manage orders and delivery seamlessly' },
            ].map((benefit, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-white/70 backdrop-blur rounded-lg hover:bg-white transition shadow-sm items-center">
                <div className="flex-shrink-0">{benefit.icon}</div>
                <div>
                  <p className="font-semibold text-gray-900">{benefit.title}</p>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center px-4 lg:px-8">
          <Card className="bg-white/95 backdrop-blur p-8 rounded-2xl shadow-2xl border-t-4 border-emerald-500">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isSignup ? 'Register Shop' : 'Vendor Portal'}
              </h2>
              <p className="text-gray-600">{isSignup ? 'Set up your digital storefront' : 'Manage your business operations'}</p>
            </div>

            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{errors.form}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3 animate-pulse">
                <CheckCircle className="text-emerald-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900 text-sm">✓ {isSignup ? 'Shop registered!' : 'Login successful!'}</p>
                  <p className="text-emerald-800 text-sm">Loading dashboard...</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Shop Name</label>
                  <input
                    type="text"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleChange}
                    placeholder="E.g. Fresh Valley Supermarket"
                    className={`w-full px-4 py-3 border ${errors.shopName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
                  />
                  {errors.shopName && <p className="text-red-600 text-sm mt-1">{errors.shopName}</p>}
                </div>
              )}

              {isSignup && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Business Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
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
                  placeholder="vendor@shop.com"
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
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
                  className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition`}
                />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? '🔄 Processing...' : isSignup ? '✓ Register Shop' : '→ Access Dashboard'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm mb-4">
                {isSignup ? 'Already registered?' : "Don't have a vendor account?"}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="ml-2 text-emerald-600 font-semibold hover:text-emerald-700 transition"
                >
                  {isSignup ? 'Sign In' : 'Register Here'}
                </button>
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-sm mb-3">Access other portals</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => navigate('/user-login')}
                    className="px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition font-semibold"
                  >
                    Customer
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

export default VendorLoginPageNew;