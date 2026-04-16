import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, Alert } from '../components';
import { Truck, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { authApi } from '../utils/api';

const splitName = (fullName) => {
  const trimmed = fullName.trim();
  const [firstName, ...rest] = trimmed.split(/\s+/);

  return {
    firstName,
    lastName: rest.join(' ') || 'Partner',
  };
};

export const DeliveryLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useNotification();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    vehicle: 'bike',
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
    if (isSignup && !formData.name) newErrors.name = 'Name is required';
    if (isSignup && !formData.phone) newErrors.phone = 'Phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const authResponse = isSignup
        ? await authApi.signupDelivery({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone,
            vehicleType: formData.vehicle,
            ...splitName(formData.name),
          })
        : await authApi.login({
            email: formData.email,
            password: formData.password,
          });

      login(authResponse);
      showToast(
        isSignup ? 'Delivery account created.' : 'Signed in successfully.',
        'success',
      );
      navigate('/delivery-dashboard', { replace: true });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Truck size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Delivery Partner</h1>
          <p className="text-gray-600 mt-2">
            {isSignup ? 'Join our delivery network' : 'Start delivering'}
          </p>
        </div>

        {isSignup && (
          <Alert type="info" message="Become a delivery partner and earn flexible income" />
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {errors.form ? <Alert type="error" message={errors.form} /> : null}

          {isSignup && (
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Rajesh Kumar"
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
            placeholder="you@example.com"
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

          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className="input-field"
              >
                <option value="bike">Two-wheeler</option>
                <option value="scooter">Scooter</option>
                <option value="cycle">Cycle</option>
              </select>
            </div>
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
            {isSubmitting ? 'Please wait...' : isSignup ? 'Join Now' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isSignup ? 'Already have an account?' : 'New delivery partner?'}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setFormData({ email: '', password: '', name: '', phone: '', vehicle: 'bike' });
                setErrors({});
              }}
              className="text-primary hover:text-orange-600 font-semibold ml-1 transition-colors"
            >
              {isSignup ? 'Sign In' : 'Join'}
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
              onClick={() => navigate('/vendor-login')}
            >
              Vendor
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
