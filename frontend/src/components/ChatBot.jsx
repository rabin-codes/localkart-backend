import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minus, Maximize2, Bot, Sparkles } from 'lucide-react';
import { chatbotApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const ChatBot = () => {
    const { isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your LocalKart Assistant. How can I help you today? 😊", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatbotApi.query(userMsg);
            setMessages(prev => [...prev, { text: response, isBot: true }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having a bit of trouble connecting to my brain right now. Please try again! 🧠💨", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform z-50 group"
            >
                <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-full max-w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 z-50 animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">LocalKart Assistant</h3>
                        <p className="text-[10px] text-orange-100">Always online to help you</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {messages.map((msg, i) => (
                    <div key={`${msg.isBot}-${i}-${msg.text.substring(0, 5)}`} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2`}>

                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                            msg.isBot 
                            ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' 
                            : 'bg-orange-500 text-white rounded-tr-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
                <div className="px-4 py-2 flex flex-wrap gap-2 bg-gray-50/50">
                    {['Track my order 📦', 'Fresh products? 🍎', 'Be a vendor 🏪'].map((text) => (
                        <button 
                            key={text} 
                            onClick={() => { setInput(text.replace(/ [^ ]+$/, '')); }}
                            className="text-[10px] font-medium bg-white border border-gray-200 text-gray-600 px-2 py-1 rounded-full hover:border-orange-300 hover:text-orange-500 transition"
                        >
                            {text}
                        </button>
                    ))}
                </div>
            )}

            {/* Footer Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center hover:bg-orange-600 disabled:opacity-50 transition shadow-lg"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};
