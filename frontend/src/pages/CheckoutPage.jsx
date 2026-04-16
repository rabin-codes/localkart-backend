import React, { useState } from 'react';
import { Card, Button, Input, Modal, Alert, PaymentGateway } from '../components';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { Check, Truck, MapPin, CreditCard, Lock } from 'lucide-react';

export const CheckoutPage = ({ onClose, onOrderSuccess }) => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { showToast } = useNotification();

  const [step, setStep] = useState(1);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [finalOrderData, setFinalOrderData] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateStep(1)) return;
    setStep(2);
  };

  const handlePaymentSuccess = (paymentData) => {
    showToast(`Payment successful! Transaction: ${paymentData.transactionId}`, 'success');
    setFinalOrderData(paymentData);
    setOrderPlaced(true);
    
    setTimeout(() => {
      clearCart();
      onOrderSuccess(`ORD${Date.now()}`);
    }, 2000);
  };

  const handlePaymentCancel = () => {
    setShowPaymentGateway(false);
    showToast('Payment cancelled', 'warning');
  };

  const total = getTotalPrice();
  const deliveryCharge = total > 200 ? 0 : 50;
  const finalTotal = total + deliveryCharge;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-secondary mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. Our delivery partner will reach you soon.
          </p>
          <div className="bg-gradient-to-r from-primary to-orange-500 rounded-lg p-6 mb-6 text-white">
            <p className="text-sm opacity-90 mb-1">Order ID</p>
            <p className="text-2xl font-bold">ORD{Date.now()}</p>
          </div>
          <Button onClick={onClose} className="w-full" size="lg">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-secondary mb-8 text-center">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step Indicator */}
            <div className="flex gap-4 mb-8">
              {[
                { num: 1, label: 'Delivery' },
                { num: 2, label: 'Payment' },
                { num: 3, label: 'Confirm' },
              ].map((s) => (
                <div key={s.num} className="flex-1">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      step >= s.num ? 'bg-gradient-to-r from-primary to-orange-500' : 'bg-gray-300'
                    }`}
                  />
                  <p className="text-xs text-gray-600 mt-2 text-center font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Step 1: Delivery Address */}
            {step === 1 && (
              <Card className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary">Delivery Address</h3>
                </div>

                <Alert type="info" message="Enter the address where you'd like to receive your order" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    error={errors.fullName}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    required
                  />
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    error={errors.city}
                    required
                  />
                </div>

                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  error={errors.address}
                  placeholder="Street, area, landmark"
                  required
                />

                <Input
                  label="Zip Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  error={errors.zipCode}
                  required
                />

                <div className="flex gap-2 pt-4">
                  <Button variant="secondary" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleProceedToPayment} className="flex-1">
                    Proceed to Payment →
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && !showPaymentGateway && (
              <Card className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <CreditCard size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary">Payment Method</h3>
                </div>

                <Alert
                  type="info"
                  title="Test Payment"
                  message="This is a demo checkout. Use any card details to proceed."
                />

                <div className="space-y-4">
                  <Button
                    onClick={() => setShowPaymentGateway(true)}
                    className="w-full p-6 border-2 border-primary bg-orange-50 text-left flex items-center justify-between hover:bg-orange-100"
                  >
                    <div>
                      <p className="font-semibold text-secondary">Complete Payment</p>
                      <p className="text-sm text-gray-600">Secure gateway with multiple payment options</p>
                    </div>
                    <Lock size={24} className="text-primary" />
                  </Button>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setShowPaymentGateway(true)} className="flex-1">
                    Open Payment Gateway
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <Card className="space-y-6">
                <h3 className="text-2xl font-bold text-secondary">Order Summary</h3>

                <Alert
                  type="success"
                  title="✓ Delivery Details Confirmed"
                  message={`${formData.fullName}, ${formData.address}, ${formData.city}`}
                />

                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name} x {item.quantity}</span>
                      <span className="font-medium text-secondary">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={() => setShowPaymentGateway(true)}
                    className="flex-1"
                  >
                    Place Order
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="space-y-4 sticky top-20 max-h-96">
              <h3 className="font-bold text-secondary text-lg flex items-center gap-2">
                <Truck size={20} />
                Order Summary
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm pb-2 border-b border-gray-200">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryCharge === 0 ? '🎉 FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <p className="font-semibold mb-1">🔒 100% Secure Payment</p>
                <p className="text-xs">Your payment information is encrypted and secure.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPaymentGateway && (
        <PaymentGateway
          amount={finalTotal}
          onPaymentSuccess={(paymentData) => {
            handlePaymentSuccess(paymentData);
            setShowPaymentGateway(false);
          }}
          onPaymentCancel={() => {
            handlePaymentCancel();
            setShowPaymentGateway(false);
          }}
        />
      )}
    </div>
  );
};
