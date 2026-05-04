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
    if (user) {
      setFormData((current) => ({
        ...current,
        fullName: current.fullName || user.name || '',
        email: current.email || user.email || '',
        phone: current.phone || user.phone || '',
        address: current.address || user.address || '',
        city: current.city || user.city || '',
        zipCode: current.zipCode || user.zipCode || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
    if (validateStep()) setStep(2);
  };

  const handlePaymentSuccess = async (paymentData) => {
    setIsSubmitting(true);
    try {
      // Constructing Payload to match OrderRequestDTO.java
      const orderPayload = {
        deliveryFullName: formData.fullName,
        deliveryEmail: formData.email,
        deliveryPhone: formData.phone,
        deliveryAddress: formData.address,
        deliveryCity: formData.city,
        deliveryZipCode: formData.zipCode,
        paymentMethod: paymentData.method || 'Online',
        transactionId: paymentData.transactionId,
        totalAmount: finalTotal,
        items: cart.map((item) => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await ordersApi.createOrder(orderPayload);
      
      // Axios usually returns data in .data
      const order = response.data || response;

      setFinalOrderData(order);
      setOrderPlaced(true);
      await clearCart({ silent: true, skipRequest: true });
      showToast(`Order Confirmed!`, 'success');
    } catch (error) {
      console.error("Order Error:", error.response?.data);
      showToast(error.response?.data?.message || 'Unable to place your order.', 'error');
    } finally {
      setShowPaymentGateway(false);
      setIsSubmitting(false);
    }
  };

  const total = getTotalPrice();
  const deliveryCharge = total > 200 ? 0 : 40;
  const finalTotal = total + deliveryCharge;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-12 shadow-xl">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-secondary mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">Your order is being processed.</p>
          <div className="bg-primary p-4 rounded-lg text-white mb-6 font-mono font-bold">
            {finalOrderData?.orderNumber || 'PROCESSING'}
          </div>
          <Button onClick={() => navigate('/home')} className="w-full">Continue Shopping</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 ? (
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-secondary">
                <MapPin className="text-primary"/> Shipping Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} error={errors.fullName} required />
                <Input label="Email" name="email" value={formData.email} onChange={handleInputChange} error={errors.email} required />
                <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} error={errors.phone} required />
                <Input label="City" name="city" value={formData.city} onChange={handleInputChange} error={errors.city} required />
              </div>
              <div className="mt-4">
                <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} error={errors.address} placeholder="Street name, landmark..." required />
              </div>
              <div className="mt-4 w-1/2">
                <Input label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleInputChange} error={errors.zipCode} required />
              </div>
              <Button onClick={handleProceedToPayment} className="w-full mt-6" size="lg">Proceed to Payment</Button>
            </Card>
          ) : (
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-secondary">
                <CreditCard className="text-primary"/> Secure Payment
              </h3>
              <div className="bg-orange-50 border-2 border-primary border-dashed p-8 rounded-xl text-center">
                <Lock size={48} className="mx-auto text-primary mb-4" />
                <p className="font-bold text-xl mb-2">Total Amount: ₹{finalTotal.toFixed(2)}</p>
                <Button onClick={() => setShowPaymentGateway(true)} size="lg" className="px-12">Pay Now</Button>
              </div>
              <Button variant="secondary" onClick={() => setStep(1)} className="mt-4">Edit Address</Button>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Truck/> Summary</h3>
            <div className="space-y-3 border-b pb-4 mb-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} x{item.quantity}</span>
                  <span className="font-medium text-secondary">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>₹{deliveryCharge.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-xl text-primary border-t pt-2">
                <span>Total</span><span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showPaymentGateway && (
        <PaymentGateway
          amount={finalTotal}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={() => setShowPaymentGateway(false)}
        />
      )}
    </div>
  );
};