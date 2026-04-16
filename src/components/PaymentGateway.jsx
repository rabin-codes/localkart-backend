import React, { useState } from 'react';
import { Button, Modal, Input, Alert } from './index';
import { CreditCard, Banknote, Smartphone, Server } from 'lucide-react';

export const PaymentGateway = ({ amount, onPaymentSuccess, onPaymentCancel }) => {
  const [showModal, setShowModal] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  const [upiData, setUpiData] = useState({
    upiId: '',
  });

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUPIChange = (e) => {
    const { name, value } = e.target;
    setUpiData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate payment success (90% success rate for demo)
    const isSuccess = Math.random() > 0.1;

    setIsProcessing(false);

    if (isSuccess) {
      onPaymentSuccess({
        transactionId: `TXN${Date.now()}`,
        method: paymentMethod,
        amount,
        status: 'success',
      });
      setShowModal(false);
    } else {
      alert('Payment failed. Please try again.');
    }
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, Rupay',
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Server,
      description: 'All major Indian banks',
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: Banknote,
      description: 'PayPal, Airtel Money',
    },
  ];

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        onPaymentCancel();
        setShowModal(false);
      }}
      title="Complete Payment"
      size="lg"
    >
      <div className="space-y-6">
        {/* Amount */}
        <div className="bg-gradient-to-r from-primary to-orange-500 text-white rounded-lg p-6">
          <p className="text-sm opacity-90 mb-1">Total Amount</p>
          <p className="text-4xl font-bold">₹{amount.toFixed(2)}</p>
        </div>

        {/* Payment Methods */}
        <div>
          <label className="block text-sm font-semibold text-secondary mb-4">
            Select Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    paymentMethod === method.id
                      ? 'border-primary bg-orange-50'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <Icon
                    size={24}
                    className={paymentMethod === method.id ? 'text-primary' : 'text-gray-600'}
                  />
                  <p className="font-semibold text-sm mt-2 text-secondary">
                    {method.name}
                  </p>
                  <p className="text-xs text-gray-600">{method.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Form */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <Alert
              type="info"
              message="Use test card: 4111 1111 1111 1111 | Any future date | Any CVV"
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
                placeholder="12/25"
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

        {paymentMethod === 'upi' && (
          <div className="space-y-4">
            <Alert
              type="info"
              message="Use test UPI: demo@upi"
            />
            <Input
              label="UPI ID"
              placeholder="yourname@upi"
              value={upiData.upiId}
              onChange={handleUPIChange}
              name="upiId"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
              📱 You will receive an OTP on your registered mobile number
            </div>
          </div>
        )}

        {(paymentMethod === 'netbanking' || paymentMethod === 'wallet') && (
          <div className="text-center py-4">
            <Alert
              type="info"
              message={`${paymentMethod === 'netbanking' ? 'Select your bank' : 'Connect your wallet'} on the next screen`}
            />
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? 'Processing Payment...' : `Pay ₹${amount.toFixed(2)}`}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          🔒 Your payment is secure and encrypted
        </p>
      </div>
    </Modal>
  );
};
