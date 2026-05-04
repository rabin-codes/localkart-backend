import React from 'react';
import { Zap, Clock, MapPin, User, DollarSign } from 'lucide-react';

export const DeliveryRequestCard = ({ request, onAccept, onReject }) => {
  const icons = {
    distance: <MapPin size={18} />,
    time: <Clock size={18} />,
    amount: <DollarSign size={18} />,
    from: <User size={18} />,
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all animate-slideIn">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} className="text-blue-600 animate-pulse" />
            <h3 className="font-bold text-secondary text-lg">{request.id}</h3>
          </div>
          <p className="text-sm text-gray-600">{request.from}</p>
        </div>
        <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
          {request.items} items
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-blue-200">
        <div className="text-center">
          {icons.distance}
          <p className="text-xs text-gray-600 mt-1">Distance</p>
          <p className="font-bold text-secondary">{request.distance}</p>
        </div>
        <div className="text-center">
          {icons.time}
          <p className="text-xs text-gray-600 mt-1">Est. Time</p>
          <p className="font-bold text-secondary">{request.eta}</p>
        </div>
        <div className="text-center">
          {icons.amount}
          <p className="text-xs text-gray-600 mt-1">Earning</p>
          <p className="font-bold text-green-600">₹{request.amount}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4">📍 {request.destination}</p>

      <div className="flex gap-2">
        <button
          onClick={() => onReject(request.id)}
          className="flex-1 px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
        >
          Reject
        </button>
        <button
          onClick={() => onAccept(request.id)}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          Accept Request
        </button>
      </div>
    </div>
  );
};
