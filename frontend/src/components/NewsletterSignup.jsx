import React from 'react';
import { Mail, Check } from 'lucide-react';

export const NewsletterSignup = ({ onSubscribe }) => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      onSubscribe?.(email);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary to-orange-500 text-white p-12 rounded-2xl shadow-xl">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-2">Stay Updated! 🚀</h3>
        <p className="mb-6 opacity-90">Get special offers, new products, and delivery updates</p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-3 text-gray-500" size={20} />
            <input
              id="newsletter-email-signup"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address for newsletter subscription"
              className="w-full pl-12 pr-4 py-3 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
          >
            {subscribed ? '✓ Subscribed' : 'Subscribe'}
          </button>
        </form>

        {subscribed && (
          <p className="mt-3 text-green-200 flex items-center justify-center gap-2">
            <Check size={18} /> Thanks for subscribing!
          </p>
        )}
      </div>
    </div>
  );
};
