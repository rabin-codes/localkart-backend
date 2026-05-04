import React, { useState, useEffect } from 'react';
import { Brain, ShoppingCart, Clock, Star, TrendingUp, Zap, RefreshCw } from 'lucide-react';
import { predictionApi } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';

const PredictionPage = () => {
  const { addToCart } = useCart();
  const { showToast } = useNotification();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({});

  useEffect(() => { loadPredictions(); }, []);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const data = await predictionApi.getPredictions();
      setPredictions(data || []);
    } catch (e) {
      // If no order history, show empty state
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (prediction) => {
    setAdding(prev => ({ ...prev, [prediction.productId]: true }));
    try {
      await addToCart({ id: prediction.productId, name: prediction.productName, quantity: 1 });
    } finally {
      setAdding(prev => ({ ...prev, [prediction.productId]: false }));
    }
  };

  const urgencyConfig = {
    HIGH: { color: 'from-red-500/20 to-rose-500/20', border: 'border-red-400/40', badge: 'bg-red-500', text: 'Needed Now', icon: '🔴' },
    MEDIUM: { color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-400/40', badge: 'bg-amber-500', text: 'Due Soon', icon: '🟡' },
    LOW: { color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-400/40', badge: 'bg-blue-500', text: 'Upcoming', icon: '🔵' },
  };

  const emptyStateProducts = [
    { icon: '🥛', text: 'Milk every Monday' },
    { icon: '💊', text: 'Vitamins weekly' },
    { icon: '🍚', text: 'Rice monthly' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 pt-16">
      <div className="max-w-4xl mx-auto p-4">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-violet-500/30">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Shopping Assistant</h1>
          <p className="text-indigo-300 text-sm max-w-md mx-auto">
            Based on your order history, I predict what you'll need next — so you never run out of essentials.
          </p>
          <button
            onClick={loadPredictions}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-indigo-300 text-sm transition mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Predictions
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
            <p className="text-indigo-300 text-sm">Analyzing your order patterns...</p>
          </div>
        ) : predictions.length === 0 ? (
          <div className="text-center py-16">
            {/* Empty state */}
            <div className="max-w-sm mx-auto bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-8">
              <Brain className="w-16 h-16 text-indigo-400/40 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">Building Your Profile</h3>
              <p className="text-indigo-300/70 text-sm mb-6">
                Place a few orders and I'll start predicting what you need before you do!
              </p>
              <div className="space-y-3 text-left mb-6">
                <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wider">What I'll predict for you:</p>
                {emptyStateProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                    <span className="text-2xl">{p.icon}</span>
                    <span className="text-white text-sm">{p.text}</span>
                    <Clock className="w-4 h-4 text-indigo-400 ml-auto" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-indigo-300/50">
                  <Zap className="w-3 h-3" /> Predictions improve with every order
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-semibold">{predictions.length} predictions for you</p>
              <div className="flex gap-2 text-xs">
                {['HIGH', 'MEDIUM', 'LOW'].map(u => (
                  <span key={u} className={`px-2 py-0.5 rounded-full text-white bg-opacity-70 ${urgencyConfig[u].badge}`}>
                    {urgencyConfig[u].icon} {urgencyConfig[u].text}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictions.map((pred, i) => {
                const cfg = urgencyConfig[pred.urgency] || urgencyConfig.LOW;
                return (
                  <div key={i} className={`bg-gradient-to-br ${cfg.color} border ${cfg.border} rounded-2xl overflow-hidden backdrop-blur-sm`}>
                    <div className="p-5 flex gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/10">
                        <img
                          src={pred.productImage}
                          alt={pred.productName}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.src = 'https://via.placeholder.com/80'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-white font-bold text-sm leading-tight truncate">{pred.productName}</h3>
                          <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full text-white font-semibold ${cfg.badge}`}>
                            {cfg.text}
                          </span>
                        </div>
                        <p className="text-indigo-200/70 text-xs mb-2">{pred.categoryName}</p>

                        {/* AI Reason */}
                        <div className="flex items-start gap-1.5 mb-3">
                          <Brain className="w-3 h-3 text-indigo-400 flex-shrink-0 mt-0.5" />
                          <p className="text-indigo-200 text-xs leading-relaxed">{pred.reason}</p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-3 mb-3 text-xs text-indigo-300/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {pred.daysSinceLastOrder}d ago
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {pred.averageOrderIntervalDays}d avg
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {Math.round((pred.confidence || 0) * 100)}% match
                          </span>
                        </div>

                        {/* Confidence bar */}
                        <div className="h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full transition-all"
                            style={{ width: `${(pred.confidence || 0) * 100}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-white font-bold text-lg">₹{pred.productPrice}</span>
                          <button
                            onClick={() => handleAddToCart(pred)}
                            disabled={adding[pred.productId]}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 rounded-xl text-white text-xs font-bold transition disabled:opacity-50"
                          >
                            {adding[pred.productId] ? (
                              <div className="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin" />
                            ) : (
                              <ShoppingCart className="w-3 h-3" />
                            )}
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info footer */}
            <div className="mt-6 flex items-center gap-2 text-xs text-indigo-300/40 justify-center">
              <Brain className="w-3 h-3" />
              <span>Predictions update as you shop more. AI improves with every order.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;
