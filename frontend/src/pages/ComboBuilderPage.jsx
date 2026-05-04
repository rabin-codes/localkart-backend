import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, Zap, Store, MapPin, ChevronRight, CheckCircle, Package } from 'lucide-react';
import { productsApi, comboApi, categoriesApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const ComboBuilderPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [comboItems, setComboItems] = useState([]);
  const [comboName, setComboName] = useState('My Sunday Essentials');
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState(1); // 1=build, 2=checkout
  const [deliveryInfo, setDeliveryInfo] = useState({
    deliveryAddress: '',
    deliveryCity: '',
    deliveryPhone: '',
    paymentMethod: 'COD',
  });

  useEffect(() => {
    if (user) {
      setDeliveryInfo(prev => ({
        ...prev,
        deliveryAddress: user.address || prev.deliveryAddress,
        deliveryCity: user.city || prev.deliveryCity,
        deliveryPhone: user.phone || prev.deliveryPhone,
      }));
    }
  }, [user]);

  const [success, setSuccess] = useState(null);


  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (comboItems.length > 0) {
      loadSuggestion();
    } else {
      setSuggestion(null);
    }
  }, [comboItems]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        categoriesApi.getCategories().catch(() => []),
        productsApi.getProducts({ size: 60 }).catch(() => ({ content: [] })),
      ]);
      setCategories(catRes?.content || []);
      setProducts((prodRes?.content || []).filter(p => p.stock > 0));
    } catch (e) {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestion = async () => {
    try {
      const ids = comboItems.map(i => i.id);
      const res = await comboApi.suggestCombo(ids);
      setSuggestion(res);
    } catch {}
  };

  const addToCombo = (product) => {
    setComboItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to combo!`, 'success');
  };

  const updateQty = (id, delta) => {
    setComboItems(prev => prev
      .map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setComboItems(prev => prev.filter(i => i.id !== id));
  };

  const getTotal = () => comboItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const getDeliveryFee = () => getTotal() > 500 ? 0 : 40;

  const placeOrder = async () => {
    if (comboItems.length === 0) { showToast('Add items to your combo first', 'warning'); return; }
    setPlacing(true);
    try {
      const payload = {
        comboName,
        items: comboItems.map(i => ({ productId: i.id, quantity: i.quantity })),
        ...deliveryInfo,
      };
      const order = await comboApi.createComboOrder(payload);
      setSuccess(order);
      setStep(3);
      showToast('🎉 Combo order placed successfully!', 'success');
    } catch (e) {
      showToast(e.message || 'Failed to place combo order', 'error');
    } finally {
      setPlacing(false);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.categoryId === selectedCategory);

  const shopGroups = comboItems.reduce((acc, item) => {
    const shop = item.shopName || item.vendorName || 'Local Shop';
    acc[shop] = [...(acc[shop] || []), item];
    return acc;
  }, {});

  if (success && step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Combo Placed! 🎉</h2>
          <p className="text-emerald-200 mb-2">Order #{success.orderNumber}</p>
          <div className="bg-white/5 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm text-white/70">
              <span>Items from {success.shopCount || Object.keys(shopGroups).length} shops</span>
              <span className="text-white font-semibold">₹{success.totalAmount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-white/70">
              <span>Single Delivery Fee 🚀</span>
              <span className="text-emerald-300 font-bold">₹{success.deliveryCharge}</span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold">
              <span>Grand Total</span>
              <span className="text-emerald-300">₹{success.grandTotal?.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-emerald-200/70 text-sm mb-6">One delivery partner picks everything from all shops!</p>
          <button onClick={() => navigate('/home')} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl text-white font-bold hover:opacity-90 transition">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-16">
      <div className="max-w-7xl mx-auto p-4">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Smart Combo Builder</h1>
              <p className="text-purple-300 text-sm">Combine items from multiple local shops — one delivery, one fee!</p>
            </div>
          </div>

          {/* Savings Banner */}
          {suggestion && suggestion.shopCount > 1 && (
            <div className="mt-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-xl p-4 flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-amber-300 font-bold">{suggestion.message}</p>
                <p className="text-amber-200/60 text-xs">vs paying ₹{suggestion.shopCount * 40} for separate deliveries</p>
              </div>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Browser */}
            <div className="lg:col-span-2">
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    selectedCategory === 'all'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  🛍️ All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                      selectedCategory === cat.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-2xl h-56 animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredProducts.map(product => {
                    const inCombo = comboItems.find(i => i.id === product.id);
                    return (
                      <div
                        key={product.id}
                        className={`bg-white/5 backdrop-blur rounded-2xl border overflow-hidden transition hover:scale-[1.02] ${
                          inCombo ? 'border-purple-400 ring-1 ring-purple-400' : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.src = `https://picsum.photos/seed/${product.id}/200`; }}
                          />
                          {inCombo && (
                            <div className="absolute top-2 right-2 bg-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                              {inCombo.quantity}
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-white text-sm font-semibold leading-tight mb-1 truncate">{product.name}</p>
                          <p className="text-purple-300 text-xs mb-2">{product.shopName || product.vendorName}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-white font-bold text-sm">₹{product.price}</span>
                            <button
                              onClick={() => addToCombo(product)}
                              className="w-7 h-7 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center text-white transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Combo Cart */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 h-fit sticky top-20">
              <div className="p-4 border-b border-white/10">
                <input
                  value={comboName}
                  onChange={e => setComboName(e.target.value)}
                  className="w-full bg-transparent text-white font-bold text-lg focus:outline-none border-b border-white/20 pb-1"
                  placeholder="Name your combo..."
                />
                <p className="text-purple-300 text-xs mt-1">{comboItems.length} items • {Object.keys(shopGroups).length} shops</p>
              </div>

              <div className="p-4 max-h-80 overflow-y-auto space-y-2">
                {comboItems.length === 0 ? (
                  <div className="text-center py-8 text-white/30">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Add items from different shops</p>
                  </div>
                ) : (
                  Object.entries(shopGroups).map(([shop, items]) => (
                    <div key={shop} className="mb-3">
                      <p className="text-purple-300 text-xs font-semibold mb-1 flex items-center gap-1">
                        <Store className="w-3 h-3" /> {shop}
                      </p>
                      {items.map(item => (
                        <div key={item.id} className="flex items-center gap-2 py-2 border-b border-white/5">
                          <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                            onError={e => { e.target.src = `https://picsum.photos/seed/${item.id}/32`; }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                            <p className="text-purple-300 text-xs">₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateQty(item.id, -1)} className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white text-xs w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 ml-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>

              {comboItems.length > 0 && (
                <div className="p-4 border-t border-white/10">
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-sm text-white/70">
                      <span>Subtotal</span><span className="text-white">₹{getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Delivery (all shops)</span>
                      <span className={getDeliveryFee() === 0 ? 'text-green-400 font-bold' : 'text-white'}>
                        {getDeliveryFee() === 0 ? 'FREE' : `₹${getDeliveryFee()}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-white border-t border-white/10 pt-1.5">
                      <span>Total</span>
                      <span className="text-purple-300">₹{(getTotal() + getDeliveryFee()).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-purple-300 hover:text-white mb-6 transition">
              ← Back to Combo Builder
            </button>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-5">
              <h2 className="text-xl font-bold text-white">Complete Your Combo Order</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-purple-300 mb-1.5">Delivery Address *</label>
                  <input
                    value={deliveryInfo.deliveryAddress}
                    onChange={e => setDeliveryInfo({ ...deliveryInfo, deliveryAddress: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400"
                    placeholder="Street address"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-purple-300 mb-1.5">City *</label>
                    <input
                      value={deliveryInfo.deliveryCity}
                      onChange={e => setDeliveryInfo({ ...deliveryInfo, deliveryCity: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-purple-300 mb-1.5">Phone *</label>
                    <input
                      value={deliveryInfo.deliveryPhone}
                      onChange={e => setDeliveryInfo({ ...deliveryInfo, deliveryPhone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400"
                      placeholder="Phone"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-purple-300 mb-1.5">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['COD', 'ONLINE'].map(method => (
                      <button
                        key={method}
                        onClick={() => setDeliveryInfo({ ...deliveryInfo, paymentMethod: method })}
                        className={`py-3 rounded-xl font-semibold text-sm transition border ${
                          deliveryInfo.paymentMethod === method
                            ? 'bg-purple-500/30 border-purple-400 text-white'
                            : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                        }`}
                      >
                        {method === 'COD' ? '💵 Cash on Delivery' : '💳 Pay Online'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3">{comboName}</h3>
                <div className="text-sm space-y-1">
                  {Object.entries(shopGroups).map(([shop, items]) => (
                    <div key={shop}>
                      <p className="text-purple-300 font-medium flex items-center gap-1 mt-2"><Store className="w-3 h-3" /> {shop}</p>
                      {items.map(i => (
                        <div key={i.id} className="flex justify-between text-white/70 pl-4">
                          <span>{i.name} × {i.quantity}</span>
                          <span>₹{(i.price * i.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between text-white font-bold">
                    <span>Grand Total</span>
                    <span className="text-purple-300">₹{(getTotal() + getDeliveryFee()).toFixed(2)}</span>
                  </div>
                  <p className="text-green-400 text-xs">✅ Single delivery fee for all {Object.keys(shopGroups).length} shops!</p>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing || !deliveryInfo.deliveryAddress || !deliveryInfo.deliveryPhone}
                className="w-full py-4 bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-xl text-white font-bold text-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {placing ? (
                  <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> Placing...</>
                ) : (
                  <><Zap className="w-5 h-5" /> Place Combo Order</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComboBuilderPage;
