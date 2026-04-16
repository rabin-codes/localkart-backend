import React, { useState } from 'react';
import { Card, Button, Input, Alert } from '../components';
import { mockDeliveryOrders } from '../utils/mockData';
import { MapPin, Phone, Clock, CheckCircle } from 'lucide-react';

export const DeliveryPartnerUI = ({ onLogout, partnerName }) => {
  const [orders, setOrders] = useState(mockDeliveryOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Accepted': 'bg-blue-100 text-blue-800',
    'Picked-up': 'bg-purple-100 text-purple-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };

  const handleAcceptOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'Accepted' } : order
      )
    );
    setSelectedOrder(null);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const dashboardStats = [
    {
      label: 'Total Deliveries',
      value: orders.filter((o) => o.status === 'Delivered').length.toString(),
      color: 'text-green-600',
    },
    {
      label: 'Active Deliveries',
      value: orders.filter((o) => o.status === 'Accepted' || o.status === 'Picked-up').length.toString(),
      color: 'text-blue-600',
    },
    {
      label: 'Pending',
      value: orders.filter((o) => o.status === 'Pending').length.toString(),
      color: 'text-yellow-600',
    },
    {
      label: 'Earnings Today',
      value: '₹1,240',
      color: 'text-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Delivery Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {partnerName}</p>
          </div>
          <Button variant="danger" onClick={onLogout}>
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dashboardStats.map((stat, idx) => (
            <Card key={idx}>
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-secondary mb-4">Available Orders</h2>

            {orders.map((order) => (
              <Card
                key={order.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-secondary text-lg">{order.id}</p>
                    <p className="text-sm text-gray-600 mt-1">{order.customerName}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      statusColors[order.status] || 'bg-gray-100'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{order.distance}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={16} />
                    <span>15 mins</span>
                  </div>
                  <div className="font-bold text-primary text-base">
                    ₹{order.amount}
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  {order.items.join(', ')}
                </p>
              </Card>
            ))}
          </div>

          {/* Order Details */}
          {selectedOrder && (
            <Card className="lg:col-span-1 space-y-6 h-fit">
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Details</p>
                <h3 className="text-xl font-bold text-secondary">{selectedOrder.id}</h3>
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Customer</p>
                  <p className="font-semibold text-secondary">{selectedOrder.customerName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Delivery Address</p>
                  <p className="text-sm">{selectedOrder.address}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Items</p>
                  <div className="space-y-1">
                    {selectedOrder.items.map((item, idx) => (
                      <p key={idx} className="text-sm">
                        • {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Delivery Charge</p>
                  <p className="text-2xl font-bold text-primary">₹{selectedOrder.amount}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                {selectedOrder.status === 'Pending' && (
                  <Button
                    onClick={() => handleAcceptOrder(selectedOrder.id)}
                    className="w-full"
                  >
                    Accept Order
                  </Button>
                )}

                {selectedOrder.status === 'Accepted' && (
                  <Button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'Picked-up');
                      setSelectedOrder({...selectedOrder, status: 'Picked-up'});
                    }}
                    className="w-full"
                  >
                    Mark as Picked Up
                  </Button>
                )}

                {selectedOrder.status === 'Picked-up' && (
                  <Button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'Delivered');
                      setSelectedOrder({...selectedOrder, status: 'Delivered'});
                    }}
                    className="w-full"
                  >
                    Mark as Delivered
                  </Button>
                )}

                <Button
                  variant="secondary"
                  onClick={() => setSelectedOrder(null)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
