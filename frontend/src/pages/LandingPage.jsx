import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Zap, Tag, TrendingUp, MapPin, ShoppingBag, Store, Truck } from 'lucide-react';
import { Button, Card, Hero, SectionDivider, FeatureCard, TestimonialCard, AnimatedCounter, NewsletterSignup, ProductCard, ImageCarousel } from '../components';
import { mockProductsExtended, mockTestimonials, mockStats } from '../utils/mockDataExtended';
import { useNotification } from '../context/NotificationContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [displayProducts, setDisplayProducts] = useState(mockProductsExtended.slice(0, 8));

  const categories = ['all', 'vegetables', 'bakery', 'dairy', 'beverages', 'snacks'];

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setDisplayProducts(mockProductsExtended.slice(0, 8));
    } else {
      const filtered = mockProductsExtended.filter(p => p.category === category).slice(0, 8);
      setDisplayProducts(filtered);
    }
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
      <Hero />

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
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            icon={<ArrowRight className="w-5 h-5" />}
            onClick={() => showNotification('Redirecting to products...', 'info')}
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
              className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
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

      {/* Statistics Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-gradient-to-r from-orange-500 to-orange-600">
        <SectionDivider
          icon={<TrendingUp className="w-8 h-8 text-white" />}
          title="Our Impact"
          subtitle="Growing Every Day"
          titleClassName="text-white"
          subtitleClassName="text-orange-100"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter end={stat.value} duration={2000} />
                {stat.label.includes('Cities') && '+'}
              </div>
              <p className="text-orange-100 text-lg font-semibold">{stat.label}</p>
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
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* Benefits Grid Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-gray-50 to-white">
        <SectionDivider
          icon={<Tag className="w-8 h-8" />}
          title="Extra Benefits"
          subtitle="Exclusive perks for our members"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Benefit Card 1 */}
          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-orange-500">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Loyalty Rewards</h3>
            <p className="text-gray-600 mb-4">Earn points on every purchase and redeem for discounts</p>
            <Button variant="outline" size="sm">Learn More</Button>
          </div>

          {/* Benefit Card 2 */}
          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-orange-500">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Free Delivery</h3>
            <p className="text-gray-600 mb-4">Free delivery on orders above ₹500</p>
            <Button variant="outline" size="sm">View Offers</Button>
          </div>

          {/* Benefit Card 3 */}
          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-orange-500">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Quality Guarantee</h3>
            <p className="text-gray-600 mb-4">30-day money-back guarantee on all products</p>
            <Button variant="outline" size="sm">Details</Button>
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
              onClick={() => showNotification('Starting your shopping journey...', 'success')}
            >
              Shop Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => showNotification('Opening seller registration...', 'info')}
            >
              Become a Vendor
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-white">
        <div className="max-w-2xl mx-auto">
          <SectionDivider
            icon={<Tag className="w-8 h-8" />}
            title="Stay Updated"
            subtitle="Get exclusive deals and fresh product updates"
          />
          <NewsletterSignup />
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
          <div className="bg-white rounded-3xl shadow-lg border-2 border-orange-100 p-8 hover:shadow-xl hover:scale-105 transition duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Customer</h3>
            <p className="text-gray-600 mb-6">Shop fresh products from local vendors with fast delivery</p>
            <ul className="space-y-2 text-sm text-gray-700 mb-8">
              <li>✅ 30-45 min delivery</li>
              <li>✅ Fresh local products</li>
              <li>✅ Easy payments</li>
              <li>✅ Order tracking</li>
            </ul>
            <button
              onClick={() => navigate('/user-login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition transform hover:scale-105"
            >
              Sign Up / Login
            </button>
          </div>

          {/* Vendor Sign Up */}
          <div className="bg-white rounded-3xl shadow-lg border-2 border-emerald-100 p-8 hover:shadow-xl hover:scale-105 transition duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Vendor</h3>
            <p className="text-gray-600 mb-6">Grow your business by selling on our platform</p>
            <ul className="space-y-2 text-sm text-gray-700 mb-8">
              <li>✅ Reach 50k+ customers</li>
              <li>✅ Zero setup fees</li>
              <li>✅ Real-time analytics</li>
              <li>✅ Dedicated support</li>
            </ul>
            <button
              onClick={() => navigate('/vendor-login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition transform hover:scale-105"
            >
              Sign Up / Login
            </button>
          </div>

          {/* Delivery Partner Sign Up */}
          <div className="bg-white rounded-3xl shadow-lg border-2 border-blue-100 p-8 hover:shadow-xl hover:scale-105 transition duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Delivery Partner</h3>
            <p className="text-gray-600 mb-6">Earn money by delivering fresh products</p>
            <ul className="space-y-2 text-sm text-gray-700 mb-8">
              <li>✅ ₹500-1000/day</li>
              <li>✅ Flexible hours</li>
              <li>✅ Daily payouts</li>
              <li>✅ Easy management</li>
            </ul>
            <button
              onClick={() => navigate('/delivery-login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition transform hover:scale-105"
            >
              Sign Up / Login
            </button>
          </div>
        </div>
      </section>

      {/* Footer Info Section */}
      <section className="py-16 px-4 md:px-8 lg:px-12 bg-gray-900 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">LocalKart</h4>
            <p className="text-gray-400">Your trusted hyperlocal ecommerce platform for fresh products</p>
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
            <div className="flex gap-4">
              {['f', 't', 'i', 'in'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 LocalKart. All rights reserved.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
