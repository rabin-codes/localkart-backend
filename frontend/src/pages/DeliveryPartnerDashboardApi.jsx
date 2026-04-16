import React, { useEffect, useState } from 'react';
import { Truck, MapPin, Clock, DollarSign, AlertCircle, CheckCircle, LogOut, Navigation, Zap } from 'lucide-react';
import { Button, Card } from '../components';
import { useNotification } from '../context/NotificationContext';
import { deliveryApi } from '../utils/api';

export const DeliveryPartnerDashboard = ({ onLogout }) => {
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    setIsLoading(true);

    try {
      const response = await deliveryApi.getDashboard();
      setDashboard(response);
    } catch (error) {
      showToast(error.message || 'Unable to load delivery dashboard.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleAccept = async (orderId) => {
    try {
      await deliveryApi.acceptOrder(orderId);
      showToast('Order accepted.', 'success');
      await loadDashboard();
    } catch (error) {
      showToast(error.message || 'Unable to accept this order.', 'error');
    }
  };

  const handleComplete = async (orderId) => {
    try {
      await deliveryApi.completeOrder(orderId);
      showToast('Order marked as delivered.', 'success');
      await loadDashboard();
    } catch (error) {
      showToast(error.message || 'Unable to complete this order.', 'error');
    }
  };

  const stats = [
    {
      label: 'Today Earnings',
      value: `Rs. ${dashboard?.stats?.earnings ?? 0}`,
      icon: DollarSign,
      color: 'bg-gradient-to-br from-green-400 to-green-600',
    },
    {
      label: 'Deliveries Today',
      value: dashboard?.stats?.deliveries ?? 0,
      icon: Truck,
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    },
    {
      label: 'Trips Completed',
      value: dashboard?.stats?.trips ?? 0,
      icon: CheckCircle,
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
    {
      label: 'Rating',
      value: `${dashboard?.stats?.rating ?? 0}★`,
      icon: AlertCircle,
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{dashboard?.partner?.name || 'Delivery Partner Hub'}</h1>
              <p className="text-blue-100 text-sm">{dashboard?.partner?.vehicleType || 'Delivery Partner'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                isOnline
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-400 hover:bg-gray-500 text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              {isOnline ? 'Online' : 'Offline'}
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {!isOnline ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="text-yellow-600 w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-800">You're offline</p>
              <p className="text-yellow-700 text-sm">Go online to receive delivery requests</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white w-6 h-6" />
                  </div>
                  {stat.label.includes('Earnings') ? <Zap className="text-green-500 w-5 h-5" /> : null}
                </div>
                <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-600">
          {['dashboard', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold transition ${
                activeTab === tab
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Card className="bg-white p-6">
            <p className="text-gray-600">Loading delivery dashboard...</p>
          </Card>
        ) : null}

        {!isLoading && activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Available Orders</h3>
                <div className="space-y-4">
                  {(dashboard?.orders || []).map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 rounded-xl border-2 transition ${
                        order.status === 'Accepted'
                          ? 'border-green-500 bg-green-50'
                          : order.status === 'Delivered'
                            ? 'border-gray-200 bg-gray-50'
                            : 'border-blue-200 bg-blue-50 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-lg text-gray-900">{order.customerName}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {order.deliveryAddress?.city || 'Nearby order'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-2xl text-green-600">Rs. {order.total}</p>
                          <p className="text-xs text-gray-500">Order total</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-semibold">{order.distanceKm} km away</span>
                        </div>
                        {order.status === 'Delivered' ? (
                          <span className="text-sm font-semibold text-green-600">Completed</span>
                        ) : order.status === 'Accepted' ? (
                          <Button
                            variant="primary"
                            icon={<Navigation className="w-4 h-4" />}
                            className="text-sm"
                            onClick={() => handleComplete(order.id)}
                          >
                            Mark Delivered
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            onClick={() => handleAccept(order.id)}
                            className="text-sm"
                          >
                            Accept Order
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="bg-white p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Partner Summary</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                  <p className="text-3xl font-bold text-green-600">Rs. {dashboard?.stats?.earnings ?? 0}</p>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Deliveries</span>
                    <span className="font-bold text-gray-900">{dashboard?.stats?.deliveries ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Trips</span>
                    <span className="font-bold text-gray-900">{dashboard?.stats?.trips ?? 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Vehicle</span>
                    <span className="font-bold text-gray-900">{dashboard?.partner?.vehicleType || 'Bike'}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : null}

        {!isLoading && activeTab === 'orders' ? (
          <Card className="bg-white p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Order ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Customer</th>
                    <th className="px-4 py-3 text-left font-semibold">Distance</th>
                    <th className="px-4 py-3 text-left font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(dashboard?.orders || []).map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-4 py-4 font-semibold text-gray-900">{order.orderNumber}</td>
                      <td className="px-4 py-4 text-gray-700">{order.customerName}</td>
                      <td className="px-4 py-4 text-gray-900">{order.distanceKm} km</td>
                      <td className="px-4 py-4 font-semibold text-gray-900">Rs. {order.total}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Accepted'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default DeliveryPartnerDashboard;
