import React from 'react';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';

export const PaymentMethodSelector = ({ selectedMethod, onSelect, amount }) => {
  const methods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard size={24} />,
      description: 'Visa, Mastercard, RuPay',
      colors: 'from-blue-500 to-blue-600',
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone size={24} />,
      description: 'Google Pay, PhonePe, Paytm',
      colors: 'from-purple-500 to-purple-600',
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: <Wallet size={24} />,
      description: 'Amazon Pay, Mobikwik',
      colors: 'from-green-500 to-green-600',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-secondary mb-4">Choose Payment Method</h3>
      
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`w-full p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
            selectedMethod === method.id
              ? 'border-primary bg-orange-50'
              : 'border-gray-200 hover:border-primary'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-lg bg-gradient-to-r ${method.colors} text-white`}
            >
              {method.icon}
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-secondary">{method.name}</p>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
            {selectedMethod === method.id && (
              <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
            )}
          </div>
        </button>
      ))}

      {selectedMethod && (
        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-blue-800">
            💡 Secure payment. Your payment details are protected with encryption.
          </p>
        </div>
      )}
    </div>
  );
};
