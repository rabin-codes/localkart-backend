import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal } from '../components';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { ordersApi, usersApi } from '../utils/api';
import { MapPin, Phone, Mail, Edit2, LogOut, Sparkles, ShoppingBag, Bot, MessageSquare, ArrowRight } from 'lucide-react';

export const UserDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { showToast } = useNotification();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    zipCode: user?.zipCode || '',
  });

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);

      try {
        const [profile, userOrders] = await Promise.all([
          usersApi.getProfile(),
          ordersApi.getOrders(),
        ]);

        if (!isMounted) {
          return;
        }

        updateUser(profile);
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
          city: profile.city || '',
          zipCode: profile.zipCode || '',
        });
        setOrders(userOrders || []);
      } catch (error) {
        if (isMounted) {
          showToast(error.message || 'Unable to load your dashboard.', 'error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [showToast, updateUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);

    try {
      const profile = await usersApi.updateProfile(formData);
      updateUser(profile);
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        zipCode: profile.zipCode || '',
      });
      setEditModalOpen(false);
      showToast('Profile updated successfully.', 'success');
    } catch (error) {
      showToast(error.message || 'Unable to save your changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const statusBadgeColor = {
    Delivered: 'bg-green-100 text-green-800',
    Accepted: 'bg-blue-100 text-blue-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary">{user?.name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={18} />
                <span>{user?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={18} />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin size={18} className="mt-1" />
                <span>
                  {user?.address || 'No address added'}
                  {user?.city ? `, ${user.city}` : ''}
                  {user?.zipCode ? ` ${user.zipCode}` : ''}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setEditModalOpen(true)}
                variant="secondary"
                className="flex-1"
              >
                <Edit2 size={18} className="inline mr-2" />
                Edit Profile
              </Button>
              <Button onClick={onLogout} variant="danger" className="flex-1">
                <LogOut size={18} className="inline mr-2" />
                Logout
              </Button>
            </div>
          </Card>

          <div className="lg:col-span-2">
            <Card className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-secondary mb-2">Recent Orders</h2>
                <p className="text-gray-600">Your order history and live order status</p>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading your orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-secondary">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            statusBadgeColor[order.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Items:</p>
                        <p className="text-sm">
                          {order.items.map((item) => `${item.name} x ${item.quantity}`).join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-gray-600">Total:</span>
                        <span className="text-lg font-bold text-primary">Rs. {order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders yet. Start shopping!</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Card className="text-center py-6">
            <p className="text-3xl font-bold text-primary">{orders.length}</p>
            <p className="text-gray-600 mt-2">Total Orders</p>
          </Card>
          <Card className="text-center py-6">
            <p className="text-3xl font-bold text-primary">
              Rs. {orders.reduce((sum, order) => sum + Number(order.total || 0), 0)}
            </p>
            <p className="text-gray-600 mt-2">Total Spending</p>
          </Card>
          <Card className="text-center py-6">
            <p className="text-3xl font-bold text-primary">
              {orders.filter((order) => order.status === 'Delivered').length}
            </p>
            <p className="text-gray-600 mt-2">Delivered</p>
          </Card>
        </div>

        {/* New Feature Quick Links */}
        <div className="mt-10 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-secondary">Smart Shopping Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => navigate('/combo-builder')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Combo Builder</h3>
              <p className="text-sm text-gray-500 mt-2">Combine items from multiple shops in one order and save on delivery fees.</p>
              <div className="mt-4 flex items-center text-orange-600 font-semibold text-sm">
                Build Combo <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div 
              onClick={() => navigate('/predictions')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">AI Needs Predictor</h3>
              <p className="text-sm text-gray-500 mt-2">Our AI analyzes your buying patterns to predict what you might need soon.</p>
              <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm">
                View Predictions <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            <div 
              onClick={() => navigate('/chat')}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Direct Message</h3>
              <p className="text-sm text-gray-500 mt-2">Chat directly with local vendors to negotiate prices or check availability.</p>
              <div className="mt-4 flex items-center text-purple-600 font-semibold text-sm">
                Start Chatting <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile"
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserDashboard;
