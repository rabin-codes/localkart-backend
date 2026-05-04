import React, { useState } from 'react';
import { Button, Input, Alert } from './index';
import { CreditCard, Banknote, Smartphone, Server, X, Lock } from 'lucide-react';

export const PaymentGateway = ({ amount, onPaymentSuccess, onPaymentCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  const [upiData, setUpiData] = useState({ upiId: '' });

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUPIChange = (e) => {
    const { name, value } = e.target;
    setUpiData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      if (!cardData.cardNumber || !cardData.cardHolder || !cardData.expiry || !cardData.cvv) {
        alert('Please fill in all card details.');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiData.upiId) {
        alert('Please enter your UPI ID.');
        return;
      }
    }

    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, paymentMethod === 'cod' ? 800 : 2000));
    setIsProcessing(false);

    const methodLabel =
      paymentMethod === 'card'       ? 'Credit/Debit Card' :
      paymentMethod === 'upi'        ? 'UPI'               :
      paymentMethod === 'netbanking' ? 'Net Banking'       :
      paymentMethod === 'cod'        ? 'Cash on Delivery'  :
                                       'Wallet';

    onPaymentSuccess({
      transactionId: paymentMethod === 'cod' ? `COD${Date.now()}` : `TXN${Date.now()}`,
      method: methodLabel,
      amount,
      status: 'success',
    });
  };

  const paymentMethods = [
    { id: 'card',       name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, Rupay' },
    { id: 'upi',        name: 'UPI',               icon: Smartphone,  description: 'Google Pay, PhonePe, Paytm' },
    { id: 'netbanking', name: 'Net Banking',        icon: Server,      description: 'All major Indian banks' },
    { id: 'cod',        name: 'Cash on Delivery',   icon: Banknote,    description: 'Pay when delivered' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-60" onClick={onPaymentCancel} />

      {/* Modal — scrollable so content never gets cut off */}
      <div className="relative bg-white rounded-2xl shadow-2xl z-50 w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
          </div>
          <button
            onClick={onPaymentCancel}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Amount Banner */}
          <div className="bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl p-5">
            <p className="text-sm opacity-90 mb-1">Total Amount</p>
            <p className="text-4xl font-bold">₹{Number(amount).toFixed(2)}</p>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === method.id
                        ? 'border-primary bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon
                      size={22}
                      className={paymentMethod === method.id ? 'text-primary' : 'text-gray-500'}
                    />
                    <p className="font-semibold text-sm mt-2 text-gray-900">{method.name}</p>
                    <p className="text-xs text-gray-500">{method.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <Alert
                type="info"
                message="Test card: 4111 1111 1111 1111 | Any future date | Any 3-digit CVV"
              />
              <Input
                label="Cardholder Name"
                placeholder="John Doe"
                value={cardData.cardHolder}
                onChange={handleCardChange}
                name="cardHolder"
              />
              <Input
                label="Card Number"
                placeholder="4111 1111 1111 1111"
                value={cardData.cardNumber}
                onChange={handleCardChange}
                name="cardNumber"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry (MM/YY)"
                  placeholder="12/27"
                  value={cardData.expiry}
                  onChange={handleCardChange}
                  name="expiry"
                />
                <Input
                  label="CVV"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={handleCardChange}
                  name="cvv"
                  type="password"
                />
              </div>
            </div>
          )}

          {/* UPI Form */}
          {paymentMethod === 'upi' && (
            <div className="space-y-4">
              <Alert type="info" message="Demo UPI ID: demo@upi" />
              <Input
                label="UPI ID"
                placeholder="yourname@upi"
                value={upiData.upiId}
                onChange={handleUPIChange}
                name="upiId"
              />
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                📱 You will receive a payment request on your registered UPI app
              </div>
            </div>
          )}

          {/* Net Banking */}
          {paymentMethod === 'netbanking' && (
            <Alert
              type="info"
              message="You will be redirected to your bank's secure portal to complete payment."
            />
          )}

          {/* Cash on Delivery */}
          {paymentMethod === 'cod' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
              <p className="font-semibold mb-1">💵 Cash on Delivery</p>
              <p>Keep exact change ready. Our delivery partner will collect payment on arrival.</p>
            </div>
          )}

          {/* CTA Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing
              ? 'Processing...'
              : paymentMethod === 'cod'
              ? '✅ Confirm Order (COD)'
              : `Pay ₹${Number(amount).toFixed(2)}`}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            🔒 Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
};
