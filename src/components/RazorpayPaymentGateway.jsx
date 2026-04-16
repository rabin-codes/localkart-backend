import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export const RazorpayPaymentGateway = ({ amount, orderId, customerName, customerEmail, onSuccess, onFailure }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    // Mock Razorpay payment
    const razorpayOptions = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Demo key
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'LocalKart',
      description: `Order #${orderId}`,
      image: 'https://via.placeholder.com/100',
      prefill: {
        name: customerName,
        email: customerEmail,
      },
      handler: function (response) {
        setIsProcessing(false);
        onSuccess?.({
          paymentId: response.razorpay_payment_id,
          orderId: orderId,
          amount: amount,
        });
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
          onFailure?.('Payment cancelled');
        },
      },
    };

    // Simulate Razorpay
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      if (success) {
        razorpayOptions.handler({
          razorpay_payment_id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        });
      } else {
        setIsProcessing(false);
        onFailure?.('Payment failed. Please try again');
      }
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border-l-4 border-red-500 flex gap-3">
        <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800">Demo Payment Gateway</p>
          <p className="text-sm text-red-700">
            This is a demo implementation. Use any card details to proceed.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Amount:</span>
          <span className="text-primary text-3xl">₹{amount}</span>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            You will be redirected to Razorpay secure payment gateway
          </p>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isProcessing ? '⏳ Processing Payment...' : '💳 Proceed to Razorpay'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Payment processed securely by Razorpay. Your card details are not stored.
          </p>
        </div>
      </div>
    </div>
  );
};
