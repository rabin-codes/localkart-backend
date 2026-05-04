import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert, PaymentGateway } from '../components';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../utils/api';
import { Check, Truck, MapPin, CreditCard, Lock } from 'lucide-react';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  const { showToast } = useNotification();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [finalOrderData, setFinalOrderData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormData((current) => ({
      ...current,
      fullName: current.fullName || user.name || '',
      email: current.email || user.email || '',
      phone: current.phone || user.phone || '',
      address: current.address || user.address || '',
      city: current.city || user.city || '',
      zipCode: current.zipCode || user.zipCode || '',
    }));
  }, [user]);

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

  const validateStep = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateStep()) {
      return;
    }

    setStep(2);
  };

  const handleClose = () => {
    navigate('/home');
  };

  const handlePaymentSuccess = async (paymentData) => {
    setIsSubmitting(true);

    try {
      // ⚠️  Payload MUST match OrderRequestDTO.java flat fields
      const orderPayload = {
        deliveryFullName: formData.fullName,
        deliveryEmail:    formData.email,
        deliveryPhone:    formData.phone,
        deliveryAddress:  formData.address,
        deliveryCity:     formData.city,
        deliveryZipCode:  formData.zipCode,
        paymentMethod:    paymentData.method || 'Online',
        transactionId:    paymentData.transactionId || `TXN${Date.now()}`,
        totalAmount:      finalTotal,
        items: cart.map((item) => ({
          productId: item.productId || item.id,
          quantity:  item.quantity,
        })),
      };

      const order = await ordersApi.createOrder(orderPayload);

      // parseResponse already extracts payload.data — order IS the Order object
      setFinalOrderData(order);
      setOrderPlaced(true);
      await clearCart({ silent: true, skipRequest: true });
      showToast(
        `Payment successful! Order ${order?.orderNumber || 'confirmed'}.`,
        'success'
      );
    } catch (error) {
      console.error('Order creation failed:', error);
      showToast(error.message || 'Unable to place your order. Please try again.', 'error');
    } finally {
      setShowPaymentGateway(false);
      setIsSubmitting(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentGateway(false);
    showToast('Payment cancelled', 'warning');
  };

  const total = getTotalPrice();
  const deliveryCharge = total > 200 ? 0 : 40;
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
            <p className="text-2xl font-bold">{finalOrderData?.orderNumber}</p>
          </div>
          <Button onClick={() => navigate('/dashboard')} className="w-full" size="lg">
            View My Orders
          </Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-xl mx-auto">
          <Card className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-secondary">Your cart is empty</h1>
            <p className="text-gray-600">
              Add a few products before moving to checkout.
            </p>
            <Button onClick={() => navigate('/home')}>Continue Shopping</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-secondary mb-8 text-center">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-4 mb-8">
              {[
                { num: 1, label: 'Delivery' },
                { num: 2, label: 'Payment' },
                { num: 3, label: 'Confirm' },
              ].map((item) => (
                <div key={item.num} className="flex-1">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      step >= item.num ? 'bg-gradient-to-r from-primary to-orange-500' : 'bg-gray-300'
                    }`}
                  />
                  <p className="text-xs text-gray-600 mt-2 text-center font-medium">{item.label}</p>
                </div>
              ))}
            </div>

            {step === 1 ? (
              <Card className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary">Delivery Address</h3>
                </div>

                <Alert type="info" message="Enter the address where you'd like to receive your order" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} required />
                  <Input label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} error={errors.email} required />
                  <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} error={errors.phone} required />
                  <Input label="City" name="city" value={formData.city} onChange={handleInputChange} error={errors.city} required />
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
                  <Button variant="secondary" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleProceedToPayment} className="flex-1">
                    Proceed to Payment
                  </Button>
                </div>
              </Card>
            ) : null}

            {step === 2 && !showPaymentGateway ? (
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
                  message="This is a demo payment flow. Use any details to complete checkout."
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
                  <Button onClick={() => setShowPaymentGateway(true)} className="flex-1" disabled={isSubmitting}>
                    Open Payment Gateway
                  </Button>
                </div>
              </Card>
            ) : null}
          </div>

          <div>
            <Card className="space-y-4 sticky top-20 max-h-96">
              <h3 className="font-bold text-secondary text-lg flex items-center gap-2">
                <Truck size={20} />
                Order Summary
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div key={item.id || item.productId || idx} className="flex justify-between text-sm pb-2 border-b border-gray-200">
                    <span className="text-gray-600">{item.name} × {item.quantity}</span>
                    <span className="font-medium">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `Rs. ${deliveryCharge}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                    Rs. {finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {showPaymentGateway ? (
        <PaymentGateway
          amount={finalTotal}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={handlePaymentCancel}
        />
      ) : null}
    </div>
  );
};

export default CheckoutPage;
