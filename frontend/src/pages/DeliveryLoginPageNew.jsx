// src/pages/DeliveryLoginPageNew.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, AlertCircle, CheckCircle, Navigation } from 'lucide-react';
import { Card } from '../components';
import { authApi, setStoredAuthToken } from '../utils/api';

export const DeliveryLoginPageNew = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    vehicle: 'bike', // Default value
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
    if (isSignup && !formData.name) newErrors.name = 'Name is required';
    if (isSignup && !formData.phone) newErrors.phone = 'Phone is required';
    if (isSignup && !formData.vehicle) newErrors.vehicle = 'Vehicle type is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = isSignup
        ? await authApi.signupDelivery({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone,
            vehicleType: formData.vehicle.toUpperCase() // Ensure it matches backend enum if applicable
          })
        : await authApi.login({
            email: formData.email,
            password: formData.password
          });

      const token = response?.token || response?.data?.token;
      if (token) {
        setStoredAuthToken(token);
        localStorage.setItem('userRole', 'DELIVERY');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/delivery-dashboard');
      }, 1500);

    } catch (error) {
      setErrors({ form: error.message || "Failed to authenticate." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                <Truck className="text-white w-6 h-6" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                LocalKart Delivery
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">Join Our Delivery Network</p>
            <p className="text-gray-600 mb-8">Earn money by delivering fresh groceries locally.</p>
          </div>

          <div className="space-y-4">
            {[
              { icon: '💰', title: 'Earn Daily', desc: '₹500-1000 per day earning potential' },
              { icon: '⏰', title: 'Flexible Hours', desc: 'Work when you want, rest when needed' },
              { icon: '🗺️', title: 'Smart Routes', desc: 'AI-optimized delivery routes' },
              { icon: '⭐', title: 'Rewards Program', desc: 'Earn bonuses for 5+ star ratings' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-white/70 backdrop-blur rounded-lg hover:bg-white transition shadow-sm items-center">
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col justify-center px-4 lg:px-8">
          <Card className="bg-white/95 backdrop-blur p-8 rounded-2xl shadow-2xl border-t-4 border-blue-500">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isSignup ? 'Become a Partner' : 'Rider Portal'}
              </h2>
              <p className="text-gray-600">{isSignup ? 'Sign up to start delivering' : 'Access your active orders'}</p>
            </div>

            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{errors.form}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3 animate-pulse">
                <CheckCircle className="text-blue-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 text-sm">✓ {isSignup ? 'Registration successful!' : 'Login successful!'}</p>
                  <p className="text-blue-800 text-sm">Loading dashboard...</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Rajesh Kumar"
                    className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>
              )}

              {isSignup && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Vehicle</label>
                    <select
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${errors.vehicle ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white`}
                    >
                      <option value="bike">Two-wheeler</option>
                      <option value="scooter">Scooter</option>
                      <option value="cycle">Bicycle</option>
                    </select>
                    {errors.vehicle && <p className="text-red-600 text-sm mt-1">{errors.vehicle}</p>}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rider@delivery.com"
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
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
                  className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
                />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? '🔄 Processing...' : isSignup ? '✓ Join Network' : '→ Start Shift'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm mb-4">
                {isSignup ? 'Already a rider?' : "Want to join us?"}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="ml-2 text-blue-600 font-semibold hover:text-blue-700 transition"
                >
                  {isSignup ? 'Sign In' : 'Apply Now'}
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
                    onClick={() => navigate('/vendor-login')}
                    className="px-3 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition font-semibold"
                  >
                    Vendor
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

export default DeliveryLoginPageNew;