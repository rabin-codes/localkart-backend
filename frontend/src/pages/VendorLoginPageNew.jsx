import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Store, Phone, ArrowRight, TrendingUp } from 'lucide-react';
import { Button, Input, Card, Alert } from '../components';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
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

    setTimeout(() => {
      setLoading(false);
      navigate('/vendor-dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-1200 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                <Store className="text-white w-6 h-6" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">LocalKart</span>
            </div>
            <p className="text-xl text-gray-700 font-semibold">Grow Your Business Online</p>
          </div>

          <div className="space-y-4">
            {[
              { icon: '📊', title: 'Analytics & Insights', desc: 'Track sales and customer behavior' },
              { icon: '👥', title: '50K+ Customers', desc: 'Access to thousands of daily buyers' },
              { icon: '🚀', title: 'Quick Delivery', desc: 'Reach customers in 30-45 minutes' },
              { icon: '💻', title: 'Easy Management', desc: 'Manage inventory and orders online' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="text-4xl">{item.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 border border-emerald-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-emerald-600 w-6 h-6" />
              <p className="text-lg font-bold text-gray-900">500+ Vendors Earning</p>
            </div>
            <p className="text-gray-700">Average vendor earns ₹50,000+ per month on LocalKart!</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <Card className="shadow-2xl border-0">
          <div className="space-y-6 p-8 md:p-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isSignup ? 'Start Selling' : 'Vendor Login'}
              </h2>
              <p className="text-gray-600">
                {isSignup
                  ? 'Register your shop and start selling'
                  : 'Manage your shop and inventory'}
              </p>
            </div>

            <Alert
              type="info"
              message="Demo Mode: Use demo@vendor.com and any password to login"
            />

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Shop Name"
                      name="shopName"
                      icon={<Store className="w-4 h-4" />}
                      value={formData.shopName}
                      onChange={handleChange}
                      error={errors.shopName}
                      placeholder="Fresh Valley"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Phone"
                      name="phone"
                      icon={<Phone className="w-4 h-4" />}
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      placeholder="9876543210"
                      required
                    />
                  </div>
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                name="email"
                icon={<Mail className="w-4 h-4" />}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="demo@vendor.com"
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                icon={<Lock className="w-4 h-4" />}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="••••••••"
                required
              />

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-800">
                <p className="font-semibold mb-2">✓ Vendor Benefits:</p>
                <ul className="space-y-1 text-xs">
                  <li>• 0% commission on first 100 orders</li>
                  <li>• Real-time order notifications</li>
                  <li>• Dedicated vendor support</li>
                </ul>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                disabled={loading}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                {loading ? 'Processing...' : isSignup ? 'Register Shop' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm">
                {isSignup ? 'Already have a shop?' : "Don't have a shop?"}
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="ml-2 font-semibold text-emerald-600 hover:text-emerald-700 transition"
                >
                  {isSignup ? 'Sign In' : 'Register Now'}
                </button>
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <p className="text-center text-sm text-gray-600 font-semibold mb-3">Other roles:</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/user-login')}
              >
                🛒 Customer Login
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/delivery-login')}
              >
                🚚 Delivery Partner Login
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VendorLoginPageNew;
