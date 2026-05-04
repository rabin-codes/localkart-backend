import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Zap, Tag, TrendingUp, MapPin, ShoppingBag, Store, Truck, ChevronDown, Gift, Truck as TruckIcon, Shield, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { Button, Card, Hero, SectionDivider, FeatureCard, TestimonialCard, AnimatedCounter, NewsletterSignup, ProductCard } from '../components';
import { mockProductsExtended, mockTestimonials, mockStats } from '../utils/mockDataExtended';
import { useNotification } from '../context/NotificationContext';
import { emailApi } from '../utils/api';

const mockCustomerImages = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
];

const LandingPageEnhanced = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [displayProducts, setDisplayProducts] = useState(mockProductsExtended.slice(0, 8));
  const [scrollVisible, setScrollVisible] = useState(true);
  const [email, setEmail] = useState('');

  const categories = ['all', 'vegetables', 'bakery', 'dairy', 'beverages', 'snacks'];

  // Scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      setScrollVisible(window.scrollY < 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setDisplayProducts(mockProductsExtended.slice(0, 8));
    } else {
      const filtered = mockProductsExtended.filter(p => p.category === category).slice(0, 8);
      setDisplayProducts(filtered);
    }
  };

  const handleViewAllProducts = () => {
    navigate('/home');
    showNotification('Welcome to our store!', 'success');
  };

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await emailApi.notify(email, 'NEWSLETTER_SUBSCRIPTION');
        showNotification(`Newsletter subscription confirmed for ${email}!`, 'success');
        setEmail('');
      } catch (error) {
        showNotification('Failed to subscribe. Please try again.', 'error');
      }
    } else {
      showNotification('Please enter a valid email', 'error');
    }
  };

  const handleBenefitAction = (benefit) => {
    showNotification(`${benefit} details coming soon!`, 'info');
  };

  const features = [
    {
      icon: '⚡',
      title: 'Ultra-Fast Delivery',
      description: 'Get fresh products delivered to your doorstep in 30-45 minutes',
    },
    {
      icon: '🌱',
      title: '100% Fresh Local',
      description: 'Sourced directly from local farms and vendors',
    },
    {
      icon: '💳',
      title: 'Multiple Payments',
      description: 'Pay comfortably with cards, UPI, wallets, or cash',
    },
    {
      icon: '🔍',
      title: 'Quality Assured',
      description: 'Every product is checked before delivery',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Search & Browse',
      description: 'Explore thousands of fresh products from local vendors',
    },
    {
      step: 2,
      title: 'Add to Cart',
      description: 'Select your favorite items and quantity',
    },
    {
      step: 3,
      title: 'Checkout',
      description: 'Choose payment method and delivery address',
    },
    {
      step: 4,
      title: 'Track & Enjoy',
      description: 'Real-time tracking and enjoy fresh products',
    },
  ];

  const stats = [
    { label: 'Active Users', value: 50000 },
    { label: 'Daily Orders', value: 5000 },
    { label: 'Vendors', value: 500 },
    { label: 'Cities', value: 25 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero 
        cta1Action={() => navigate('/user-login')} 
        cta2Action={() => navigate('/vendor-login')}
      />

      {/* Scroll to Explore Indicator */}
      {scrollVisible && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-orange-500">
            <p className="text-sm font-semibold">Scroll to Explore</p>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
      )}

      {/* Featured Products Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-white to-orange-50">
        <SectionDivider
          icon={<ShoppingBag className="w-8 h-8" />}
          title="Featured Products"
          subtitle="Fresh & Delicious from Local Vendors"
        />

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayProducts.length > 0 ? (
            displayProducts.map(product => (
              <div key={product.id} className="animate-fadeIn">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No products found in this category</p>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            className="shine-effect"
            icon={<ArrowRight className="w-5 h-5 animate-float-arrow" />}
            onClick={handleViewAllProducts}
          >
            View All Products
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-white">
        <SectionDivider
          icon={<Zap className="w-8 h-8" />}
          title="Why Choose LocalKart?"
          subtitle="Everything you need for convenient shopping"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-gray-50 to-white">
        <SectionDivider
          icon={<TrendingUp className="w-8 h-8" />}
          title="How It Works"
          subtitle="Simple 4-step process"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((item, index) => (
            <div
              key={index}
              className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">{item.step}</span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>

              {/* Connector Line */}
              {index < howItWorks.length - 1 && (
                <div className="hidden lg:block absolute -right-6 top-1/2 w-12 h-1 bg-gradient-to-r from-orange-300 to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Statistics/Our Impact Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600">
        <SectionDivider
          icon={<TrendingUp className="w-8 h-8 text-white" />}
          title="Our Impact"
          subtitle="Transforming Local Commerce"
          titleClassName="text-white"
          subtitleClassName="text-blue-100"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter endValue={stat.value} duration={2000} />
                {stat.label.includes('Cities') && '+'}
              </div>
              <p className="text-blue-100 text-lg font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-white">
        <SectionDivider
          icon={<Star className="w-8 h-8" />}
          title="Customer Testimonials"
          subtitle="What our happy customers say"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockTestimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={mockCustomerImages[index % mockCustomerImages.length]}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-orange-500"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-gray-50 to-white">
        <SectionDivider
          icon={<Tag className="w-8 h-8" />}
          title="Extra Benefits"
          subtitle="Exclusive perks for our members"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Loyalty Rewards */}
          <div className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-500">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Loyalty Rewards</h3>
            <p className="text-gray-600 mb-4">Earn 1 point on every ₹1 spent. Redeem for amazing discounts!</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBenefitAction('Loyalty Rewards')}
              >
                Learn More
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleBenefitAction('View Offers')}
              >
                View Offers
              </Button>
            </div>
          </div>

          {/* Free Delivery */}
          <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
            <div className="text-5xl mb-4">🚚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Free Delivery</h3>
            <p className="text-gray-600 mb-4">Free delivery on orders above ₹500. Premium delivery included!</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBenefitAction('Free Delivery')}
              >
                Learn More
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleBenefitAction('View Offers')}
              >
                View Offers
              </Button>
            </div>
          </div>

          {/* Quality Guarantee */}
          <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Quality Guarantee</h3>
            <p className="text-gray-600 mb-4">30-day money-back guarantee. We promise 100% satisfaction!</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBenefitAction('Quality Guarantee')}
              >
                Learn More
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleBenefitAction('View Details')}
              >
                Details
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience Fresh Shopping?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers and get your groceries delivered fresh in just 30-45 minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="secondary"
              size="lg"
              icon={<ShoppingBag className="w-5 h-5" />}
              onClick={() => {
                navigate('/user-login');
                showNotification('Starting your shopping journey...', 'success');
              }}
            >
              Shop Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                navigate('/vendor-login');
                showNotification('Opening seller registration...', 'info');
              }}
            >
              Become a Vendor
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter/Stay Updated Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-gradient-to-r from-purple-100 to-blue-100">
        <div className="max-w-2xl mx-auto">
          <SectionDivider
            icon={<Mail className="w-8 h-8" />}
            title="Stay Updated"
            subtitle="Get exclusive deals and fresh product updates"
          />
          <form onSubmit={handleNewsletterSubscribe} className="flex flex-col sm:flex-row gap-3 mt-8">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-500"
              required
            />
            <Button
              variant="primary"
              size="lg"
              type="submit"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Authentication Section - All Roles */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-gray-100 to-white">
        <SectionDivider
          icon={<ShoppingBag className="w-8 h-8" />}
          title="Ready to Join?"
          subtitle="Choose your role and get started today"
        />

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Sign Up */}
          <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl shadow-lg border-2 border-orange-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Customer</h3>
            <p className="text-gray-600 mb-6">Shop fresh products from local vendors with lightning-fast delivery</p>
            <ul className="space-y-2 text-sm text-gray-700 mb-8">
              <li className="flex items-center gap-2"><span className="text-orange-500">✓</span> 30-45 min delivery</li>
              <li className="flex items-center gap-2"><span className="text-orange-500">✓</span> Fresh local products</li>
              <li className="flex items-center gap-2"><span className="text-orange-500">✓</span> Easy payments</li>
              <li className="flex items-center gap-2"><span className="text-orange-500">✓</span> Order tracking</li>
            </ul>
            <button
              onClick={() => navigate('/user-login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              Sign Up / Login
            </button>
          </div>

          {/* Vendor Sign Up */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl shadow-lg border-2 border-emerald-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Vendor</h3>
            <p className="text-gray-600 mb-6">Grow your business by selling fresh products on our platform</p>
            <ul className="space-y-2 text-sm text-gray-700 mb-8">
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Reach 50k+ customers</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Zero setup fees</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Real-time analytics</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Dedicated support</li>
            </ul>
            <button
              onClick={() => navigate('/vendor-login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              Sign Up / Login
            </button>
          </div>

          {/* Delivery Partner Sign Up */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-lg border-2 border-blue-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Delivery Partner</h3>
            <p className="text-gray-600 mb-6">Earn money by delivering fresh products with flexible hours</p>
            <ul className="space-y-2 text-sm text-gray-700 mb-8">
              <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> ₹500-1000/day</li>
              <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Flexible hours</li>
              <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Daily payouts</li>
              <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Easy management</li>
            </ul>
            <button
              onClick={() => navigate('/delivery-login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
            >
              Sign Up / Login
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-gray-900 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold">LocalKart</h4>
            </div>
            <p className="text-gray-400">Your trusted hyperlocal ecommerce platform for fresh, quality products delivered fast</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Contact</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Careers</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-orange-400 transition">Help Center</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Track Order</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Returns</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">FAQs</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-bold mb-4">Connect With Us</h4>
            <div className="flex gap-3 flex-wrap">
              <a href="#" className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 LocalKart. All rights reserved. | <a href="#" className="hover:text-orange-400">Privacy Policy</a> | <a href="#" className="hover:text-orange-400">Terms of Service</a></p>
        </div>
      </section>
    </div>
  );
};

export default LandingPageEnhanced;
