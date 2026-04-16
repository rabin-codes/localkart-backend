import React, { useState } from 'react';
import { Card, Button, Modal } from '../components';
import { useAuth } from '../context/AuthContext';
import { mockProducts } from '../utils/mockData';
import { User, MapPin, Phone, Mail, Edit2, LogOut } from 'lucide-react';

export const UserDashboard = ({ onLogout }) => {
  const { user } = useAuth();
  const [orders] = useState([
    {
      id: 'ORD001',
      date: '2024-04-10',
      items: ['Fresh Tomatoes', 'Bread'],
      total: 120,
      status: 'Delivered',
    },
    {
      id: 'ORD002',
      date: '2024-04-08',
      items: ['Eggs', 'Spinach'],
      total: 150,
      status: 'Delivered',
    },
    {
      id: 'ORD003',
      date: '2024-04-05',
      items: ['Coffee Beans', 'Yogurt', 'Cheese'],
      total: 420,
      status: 'Delivered',
    },
  ]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const statusBadgeColor = {
    Delivered: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
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
                <span>{user?.address || 'No address added'}</span>
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

          {/* Orders Card */}
          <div className="lg:col-span-2">
            <Card className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-secondary mb-2">Recent Orders</h2>
                <p className="text-gray-600">Your order history and status</p>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-secondary">{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString()}
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
                        <p className="text-sm">{order.items.join(', ')}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-gray-600">Total:</span>
                        <span className="text-lg font-bold text-primary">₹{order.total}</span>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Card className="text-center py-6">
            <p className="text-3xl font-bold text-primary">{orders.length}</p>
            <p className="text-gray-600 mt-2">Total Orders</p>
          </Card>
          <Card className="text-center py-6">
            <p className="text-3xl font-bold text-primary">
              ₹{orders.reduce((sum, o) => sum + o.total, 0)}
            </p>
            <p className="text-gray-600 mt-2">Total Spending</p>
          </Card>
          <Card className="text-center py-6">
            <p className="text-3xl font-bold text-primary">
              {orders.filter((o) => o.status === 'Delivered').length}
            </p>
            <p className="text-gray-600 mt-2">Delivered</p>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
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
            <Button onClick={() => setEditModalOpen(false)}>
              Save Changes
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
        </div>
      </Modal>
    </div>
  );
};
