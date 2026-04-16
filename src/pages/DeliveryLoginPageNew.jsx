import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Truck, Phone, ArrowRight, Navigation } from 'lucide-react';
import { Button, Input, Card, Alert } from '../components';

export const DeliveryLoginPageNew = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    vehicle: '',
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
    if (isSignup && !formData.name) newErrors.name = 'Name is required';
    if (isSignup && !formData.phone) newErrors.phone = 'Phone is required';
    if (isSignup && !formData.vehicle) newErrors.vehicle = 'Vehicle type is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      navigate('/delivery-dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-1200 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-lg flex items-center justify-center">
                <Truck className="text-white w-6 h-6" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">LocalKart</span>
            </div>
            <p className="text-xl text-gray-700 font-semibold">Join Our Delivery Network</p>
          </div>

          <div className="space-y-4">
            {[
              { icon: '💰', title: 'Earn Daily', desc: '₹500-1000 per day earning potential' },
              { icon: '⏰', title: 'Flexible Hours', desc: 'Work when you want, rest when needed' },
              { icon: '🗺️', title: 'Smart Routes', desc: 'AI-optimized delivery routes' },
              { icon: '⭐', title: 'Rewards Program', desc: 'Earn bonus for 5+ star ratings' },
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

          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Navigation className="text-blue-600 w-6 h-6" />
              <p className="text-lg font-bold text-gray-900">5000+ Active Partners</p>
            </div>
            <p className="text-gray-700">Join the fastest growing delivery network in the city!</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <Card className="shadow-2xl border-0">
          <div className="space-y-6 p-8 md:p-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isSignup ? 'Join as Partner' : 'Partner Login'}
              </h2>
              <p className="text-gray-600">
                {isSignup
                  ? 'Start earning with LocalKart'
                  : 'Access your delivery dashboard'}
              </p>
            </div>

            <Alert
              type="info"
              message="Demo Mode: Use demo@delivery.com and any password to login"
            />

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Full Name"
                        name="name"
                        icon={<Truck className="w-4 h-4" />}
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="John Smith"
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Vehicle Type
                    </label>
                    <select
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select vehicle type</option>
                      <option value="bike">Bike / Scooter</option>
                      <option value="cycle">Cycle</option>
                      <option value="auto">Auto / Tuk-Tuk</option>
                      <option value="car">Car</option>
                    </select>
                    {errors.vehicle && (
                      <p className="text-red-500 text-xs mt-1">{errors.vehicle}</p>
                    )}
                  </div>
                </>
              )}

              <Input
                label="Email Address"
                type="email"
                name="email"
                icon={<Mail className="w-4 h-4" />}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="demo@delivery.com"
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">✓ Partner Benefits:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Instant payment after every delivery</li>
                  <li>• Free accident insurance coverage</li>
                  <li>• 24/7 customer support</li>
                </ul>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                disabled={loading}
                icon={<ArrowRight className="w-5 h-5" />}
              >
                {loading ? 'Processing...' : isSignup ? 'Register Now' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm">
                {isSignup ? 'Already registered?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="ml-2 font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  {isSignup ? 'Sign In' : 'Register'}
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
                onClick={() => navigate('/vendor-login')}
              >
                👨‍💼 Vendor Login
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryLoginPageNew;
