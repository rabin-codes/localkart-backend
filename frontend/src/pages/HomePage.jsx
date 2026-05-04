import React, { useState, useEffect } from 'react';
import { ProductCard, Input, Button, Accordion, Carousel, StatsSection, Testimonials, Footer } from '../components';
import { categories, faqItems } from '../utils/mockData';
import { useNotification } from '../context/NotificationContext';
import { productsApi } from '../utils/api';
import { MapPin, Clock, Star, Zap, Leaf, Shield, TrendingUp, Gift, Loader2 } from 'lucide-react';

export const HomePage = ({ onProductClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]); // Increased range for electronics
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useNotification();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productsApi.getProducts();
        // Backend returns { products: [], totalProducts: ... }
        setProducts(data.products || data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        showToast('Failed to load products. Showing offline data.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [showToast]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category?.id === selectedCategory || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  });


  const carouselItems = [
    {
      image: '/images/tomato.svg',
      title: 'Fresh Produce Delivered',
      description: 'Get organic vegetables and fruits to your doorstep',
    },
    {
      image: '/images/pepper.svg',
      title: 'Bakery Fresh Goods',
      description: 'Daily baked products from local bakeries',
    },
    {
      image: '/images/spinach.svg',
      title: 'Premium Offerings',
      description: 'Curated selection of quality local products',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: '30-45 Min Delivery',
      description: 'Lightning-fast delivery to your location',
    },
    {
      icon: Leaf,
      title: 'Fresh & Quality',
      description: 'Direct from local vendors, always fresh',
    },
    {
      icon: Shield,
      title: '100% Safe',
      description: 'Verified vendors and secure transactions',
    },
    {
      icon: Gift,
      title: 'Great Deals',
      description: 'Daily discounts and exclusive offers',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-orange-400 to-red-400 text-white py-16 px-4 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl -bottom-20 -right-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-white bg-opacity-20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-white border-opacity-30">
                  🎉 Launch Special: 30% OFF
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your Local Mart, Delivered Fast
              </h1>

              <p className="text-lg opacity-90 max-w-lg">
                Fresh produce, bakery items, and essentials from trusted local vendors. Delivered to your doorstep in 30-45 minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="ghost" className="text-white border-2 border-white">
                  Start Shopping
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Learn More
                </Button>
              </div>

              <div className="flex gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-yellow-200" />
                  <span className="text-sm">Service Area</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-yellow-200" />
                  <span className="text-sm">30-45 mins</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <img
                src="/images/tomato.svg"
                alt="Hero"
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-secondary mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary mb-2">Featured Collections</h2>
            <p className="text-gray-600">Explore our curated selections</p>
          </div>
          <Carousel items={carouselItems} autoPlay={true} interval={6000} />
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 px-4 bg-white sticky top-16 z-20 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="🔍 Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
              <label 
                htmlFor="priceRange"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <input
                id="priceRange"
                name="priceRange"
                type="range"
                min="0"
                max="5000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-secondary hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-2">
              <TrendingUp className="text-primary" />
              {selectedCategory === 'all' ? 'Featured Products' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available • Sort by: {selectedCategory === 'all' ? 'Popular' : 'Trending'}
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-gray-500 font-medium animate-pulse">Fetching fresh products for you...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="transform hover:scale-105 transition-all duration-300">
                  <ProductCard
                    product={product}
                    onViewDetail={() => onProductClick(product)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl">
              <p className="text-gray-500 text-lg font-medium">No products found ✓</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters or search term</p>
            </div>
          )}

        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Promotional Banner */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-12 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl -top-20 -left-20"></div>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-4xl font-bold mb-4">Today's Special Offer</h3>
              <p className="text-lg opacity-90 mb-6">
                Get up to 50% OFF on selected items. Limited time offer for new users!
              </p>
              <Button size="lg" variant="ghost" className="text-white border-2 border-white">
                Claim Offer →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about LocalKart</p>
          </div>
          <Accordion items={faqItems} />
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Email Signup Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-secondary to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Exclusive Deals First</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get 20% OFF on your first order!
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="Enter your email"
              aria-label="Email address for newsletter"
              className="flex-1 px-4 py-3 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button size="lg" className="bg-primary hover:bg-orange-600">
              Subscribe
            </Button>
          </div>
          <p className="text-sm opacity-75 mt-4">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
