import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, Alert } from '../components';
import { Store, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authApi } from '../utils/api';

export const VendorLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useNotification();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    shopName: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (isSignup && !formData.shopName) newErrors.shopName = 'Shop name is required';
    if (isSignup && !formData.phone) newErrors.phone = 'Phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const authResponse = isSignup
        ? await authApi.signupVendor({
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            shopName: formData.shopName,
            shopAddress: `${formData.shopName} Store`,
          })
        : await authApi.login({
            email: formData.email,
            password: formData.password,
          });

      login(authResponse);
      showToast(
        isSignup ? 'Vendor account created.' : 'Vendor login successful.',
        'success',
      );
      navigate('/vendor-dashboard', { replace: true });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: error.message,
      }));
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Store size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary">Vendor Portal</h1>
          <p className="text-gray-600 mt-2">
            {isSignup ? 'Register your shop' : 'Manage your inventory'}
          </p>
        </div>

        {isSignup && (
          <Alert type="info" message="Register to start selling on LocalKart" />
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {errors.form ? <Alert type="error" message={errors.form} /> : null}

          {isSignup && (
            <Input
              label="Shop Name"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              error={errors.shopName}
              placeholder="Fresh Valley"
              required
            />
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="vendor@shop.com"
            required
          />

          {isSignup && (
            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="9876543210"
              required
            />
          )}

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            required
          />

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : isSignup ? 'Register Shop' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isSignup ? 'Already registered?' : "Don't have a shop?"}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setFormData({ email: '', password: '', shopName: '', phone: '' });
                setErrors({});
              }}
              className="text-primary hover:text-orange-600 font-semibold ml-1 transition-colors"
            >
              {isSignup ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center mb-3">
            Shop as a different role?
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/user-login')}
            >
              Customer
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/delivery-login')}
            >
              Delivery
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
