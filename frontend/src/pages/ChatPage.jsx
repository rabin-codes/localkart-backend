import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, ShoppingBag, DollarSign, User, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { chatApi, productsApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ChatPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentVendorId, setCurrentVendorId] = useState(null);
  const [currentVendorName, setCurrentVendorName] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingOffer, setSendingOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [showOfferPanel, setShowOfferPanel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    loadConversations();
    loadUnreadCount();
  }, []);

  const loadConversations = async () => {
    try {
      const rooms = await chatApi.getConversations();
      setConversations(rooms || []);
    } catch {}
  };

  const loadUnreadCount = async () => {
    try {
      const data = await chatApi.getUnreadCount();
      setUnreadCount(data?.count || 0);
    } catch {}
  };

  const openChat = async (vendorId, vendorName) => {
    setCurrentVendorId(vendorId);
    setCurrentVendorName(vendorName);
    setLoading(true);
    try {
      const msgs = await chatApi.getMessages(vendorId);
      setMessages(msgs || []);
      await chatApi.markAsRead(vendorId);
    } catch (e) {
      showToast('Could not load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentVendorId) return;
    try {
      const sent = await chatApi.sendMessage({
        recipientId: currentVendorId,
        message: input.trim(),
        messageType: 'TEXT',
      });
      setMessages(prev => [...prev, sent]);
      setInput('');
    } catch {
      showToast('Failed to send message', 'error');
    }
  };

  const sendOffer = async () => {
    if (!offerAmount || !selectedProduct) return;
    setSendingOffer(true);
    try {
      const sent = await chatApi.sendMessage({
        recipientId: currentVendorId,
        message: `💰 Price Offer for "${selectedProduct.name}": ₹${offerAmount}`,
        messageType: 'OFFER',
        offerPrice: parseFloat(offerAmount),
        productId: selectedProduct.id,
      });
      setMessages(prev => [...prev, sent]);
      setShowOfferPanel(false);
      setOfferAmount('');
      showToast('Offer sent!', 'success');
    } catch {
      showToast('Failed to send offer', 'error');
    } finally {
      setSendingOffer(false);
    }
  };

  const isMe = (msg) => msg.senderId === user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 pt-16">
      <div className="max-w-6xl mx-auto p-4 h-[calc(100vh-64px)]">
        <div className="flex h-full gap-4">

          {/* ── Sidebar: Conversations ── */}
          <div className="w-80 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-white">
                <MessageCircle className="w-5 h-5 text-violet-300" />
                <h2 className="font-bold text-lg">Chats</h2>
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unreadCount}</span>
                )}
              </div>
            </div>

            {/* Sample vendors to chat with */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {[
                { id: 1, name: 'Fresh Valley Store', shop: 'Fresh Valley', category: 'Grocery' },
                { id: 2, name: 'TechZone Hub', shop: 'TechZone Hub', category: 'Electronics' },
                { id: 3, name: 'MediCare Pharmacy', shop: 'MediCare', category: 'Pharmacy' },
                { id: 4, name: 'Style Street', shop: 'Style Street', category: 'Fashion' },
              ].map(vendor => (
                <button
                  key={vendor.id}
                  onClick={() => openChat(vendor.id, vendor.shop)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left ${
                    currentVendorId === vendor.id
                      ? 'bg-violet-500/40 border border-violet-400'
                      : 'hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {vendor.shop.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{vendor.shop}</p>
                    <p className="text-violet-300 text-xs">{vendor.category}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-white/10">
              <p className="text-violet-300 text-xs text-center">
                💬 Chat with vendors directly
              </p>
            </div>
          </div>

          {/* ── Chat Window ── */}
          <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex flex-col overflow-hidden">
            {!currentVendorId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-violet-500/30 flex items-center justify-center mb-4">
                  <MessageCircle className="w-10 h-10 text-violet-300" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Start a Conversation</h3>
                <p className="text-violet-300 text-sm max-w-xs">
                  Select a vendor from the left to chat, ask about products, check availability,
                  or negotiate prices directly.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-3 w-full max-w-xs">
                  {[
                    { icon: '📦', text: 'Check product availability' },
                    { icon: '💰', text: 'Negotiate prices directly' },
                    { icon: '⏱️', text: 'Get instant answers' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl p-3">
                      <span className="text-xl">{f.icon}</span>
                      <span className="text-white text-sm">{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center gap-3">
                  <button
                    onClick={() => setCurrentVendorId(null)}
                    className="text-violet-300 hover:text-white transition md:hidden"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white font-bold">
                    {currentVendorName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold">{currentVendorName}</p>
                    <p className="text-green-400 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> Online
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOfferPanel(!showOfferPanel)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-amber-300 text-sm font-semibold border border-amber-400/30 transition"
                  >
                    <DollarSign className="w-4 h-4" />
                    Make Offer
                  </button>
                </div>

                {/* Offer Panel */}
                {showOfferPanel && (
                  <div className="p-4 border-b border-white/10 bg-amber-500/10">
                    <h4 className="text-amber-300 font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Price Negotiation
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={offerAmount}
                        onChange={e => setOfferAmount(e.target.value)}
                        placeholder="Your offer price ₹"
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={sendOffer}
                        disabled={sendingOffer || !offerAmount}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white font-semibold text-sm disabled:opacity-50 transition"
                      >
                        {sendingOffer ? '...' : 'Send'}
                      </button>
                      <button onClick={() => setShowOfferPanel(false)} className="p-2 text-white/50 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-400 border-t-transparent"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-violet-300/60 mt-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No messages yet. Say hello! 👋</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} className={`flex ${isMe(msg) ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                          isMe(msg)
                            ? 'bg-violet-500 text-white rounded-br-sm'
                            : 'bg-white/15 text-white rounded-bl-sm'
                        }`}>
                          {msg.messageType === 'OFFER' && (
                            <div className="flex items-center gap-1 mb-1">
                              <DollarSign className="w-3 h-3 text-amber-300" />
                              <span className="text-amber-300 text-xs font-semibold">Price Offer</span>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                          <p className={`text-xs mt-1 ${isMe(msg) ? 'text-violet-200' : 'text-white/40'}`}>
                            {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-white/10 flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={`Message ${currentVendorName}...`}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-violet-400 transition"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="px-4 py-3 bg-violet-500 hover:bg-violet-600 disabled:opacity-40 rounded-xl text-white transition flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
