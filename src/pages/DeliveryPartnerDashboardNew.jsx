import React, { useState } from 'react';
import { Truck, MapPin, Clock, DollarSign, Phone, AlertCircle, CheckCircle, LogOut, Navigation, Zap } from 'lucide-react';
import { Button, Card } from '../components';
import { useNavigate } from 'react-router-dom';

export const DeliveryPartnerDashboardNew = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(false);
  const [orders, setOrders] = useState([
    { id: 'ORD001', customer: 'Priya Sharma', location: '2.3 km away', amount: '₹40', status: 'Accepted', time: '12 mins', distance: 2.3, rating: 5 },
    { id: 'ORD002', customer: 'Rajesh Kumar', location: '5.1 km away', amount: '₹50', status: 'Available', time: '18 mins', distance: 5.1, rating: 0 },
    { id: 'ORD003', customer: 'Anjali Patel', location: '1.8 km away', amount: '₹35', status: 'Completed', time: '8 mins', distance: 1.8, rating: 5 },
    { id: 'ORD004', customer: 'Vikram Singh', location: '7.2 km away', amount: '₹60', status: 'Available', time: '25 mins', distance: 7.2, rating: 0 },
    { id: 'ORD005', customer: 'Meera Gupta', location: '3.5 km away', amount: '₹45', status: 'Completed', time: '15 mins', distance: 3.5, rating: 4 },
    { id: 'ORD006', customer: 'Arjun Patel', location: '4.2 km away', amount: '₹55', status: 'Available', time: '20 mins', distance: 4.2, rating: 0 },
  ]);

  const [todayStats] = useState({
    deliveries: 12,
    earnings: 580,
    trips: 9,
    rating: 4.9,
  });

  const stats = [
    {
      label: 'Today Earnings',
      value: `₹${todayStats.earnings}`,
      icon: DollarSign,
      color: 'bg-gradient-to-br from-green-400 to-green-600',
    },
    {
      label: 'Deliveries Today',
      value: todayStats.deliveries,
      icon: Truck,
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
    },
    {
      label: 'Trips Completed',
      value: todayStats.trips,
      icon: CheckCircle,
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
    {
      label: 'Rating',
      value: `${todayStats.rating}★`,
      icon: AlertCircle,
      color: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    },
  ];

  const handleAccept = (orderId) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Accepted' } : o));
  };

  const handlelogout = () => {
    navigate('/delivery-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Delivery Partner Hub</h1>
              <p className="text-blue-100 text-sm">Partner ID: DP#2024001</p>
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
              onClick={handlelogout}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {!isOnline && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="text-yellow-600 w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-800">You're offline</p>
              <p className="text-yellow-700 text-sm">Go online to receive delivery requests</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white w-6 h-6" />
                  </div>
                  {stat.label.includes('Earnings') && <Zap className="text-green-500 w-5 h-5" />}
                </div>
                <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-600">
          {['dashboard', 'orders', 'earnings', 'settings'].map((tab) => (
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

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Orders */}
            <div className="lg:col-span-2">
              <Card className="bg-white p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Available Orders</h3>
                <div className="space-y-4">
                  {orders.filter(o => o.status !== 'Completed').map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 rounded-xl border-2 transition ${
                        order.status === 'Accepted'
                          ? 'border-green-500 bg-green-50'
                          : 'border-blue-200 bg-blue-50 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-lg text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {order.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-2xl text-green-600">{order.amount}</p>
                          <p className="text-xs text-gray-500">Delivery fee</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-semibold">{order.time}</span>
                        </div>
                        {order.status === 'Accepted' ? (
                          <Button
                            variant="primary"
                            icon={<Navigation className="w-4 h-4" />}
                            className="text-sm"
                          >
                            Start Delivery
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

            {/* Today Summary */}
            <Card className="bg-white p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Today Summary</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                  <p className="text-3xl font-bold text-green-600">₹{todayStats.earnings}</p>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Deliveries</span>
                    <span className="font-bold text-gray-900">{todayStats.deliveries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Trips</span>
                    <span className="font-bold text-gray-900">{todayStats.trips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Avg. per trip</span>
                    <span className="font-bold text-gray-900">₹{Math.round(todayStats.earnings / todayStats.trips)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
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
                    <th className="px-4 py-3 text-left font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-4 py-4 font-semibold text-gray-900">{order.id}</td>
                      <td className="px-4 py-4 text-gray-700">{order.customer}</td>
                      <td className="px-4 py-4 text-gray-900">{order.distance} km</td>
                      <td className="px-4 py-4 font-semibold text-gray-900">{order.amount}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Accepted'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {order.rating > 0 ? (
                          <span className="text-yellow-500 font-bold">{'★'.repeat(order.rating)}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Earnings</h3>
              <div className="space-y-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                  <div key={day} className="flex items-center gap-4">
                    <span className="w-12 font-semibold text-gray-600">{day}</span>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-16 text-right font-bold text-gray-900">
                      ₹{Math.round(Math.random() * 500 + 200)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Earnings Breakdown</h3>
              <div className="space-y-3">
                {[
                  { type: 'Delivery Orders', amount: '₹2,450', percentage: 70 },
                  { type: 'Premium Deliveries', amount: '₹840', percentage: 20 },
                  { type: 'Bonuses & Incentives', amount: '₹330', percentage: 10 },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-900">{item.type}</span>
                      <span className="font-bold text-cyan-600">{item.amount}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-500"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-semibold text-gray-900">Vikram Patel</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900">+91 98765 43210</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Vehicle Type</p>
                  <p className="font-semibold text-gray-900">Bike (Bajaj Discover)</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">License Number</p>
                  <p className="font-semibold text-gray-900">MH-02-AL-1234</p>
                </div>
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </div>
            </Card>

            <Card className="bg-white p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Preferences & Safety</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition border border-gray-200">
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">Receive notifications</span>
                    <p className="text-xs text-gray-600">Get alerts for new orders and updates</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition border border-gray-200">
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">Share location on map</span>
                    <p className="text-xs text-gray-600">Let customers track your delivery</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition border border-gray-200">
                  <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">Show availability on map</span>
                    <p className="text-xs text-gray-600">Appear available to nearby customers</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition border border-gray-200">
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
                  <div className="flex-1">
                    <span className="font-semibold text-gray-900">Enable sound notifications</span>
                    <p className="text-xs text-gray-600">Audio alerts for new orders</p>
                  </div>
                </label>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
