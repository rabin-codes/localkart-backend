import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ProductCard,
  Input,
  Button,
  Accordion,
  Carousel,
  StatsSection,
  Testimonials,
  Footer,
} from '../components';
import { faqItems } from '../utils/mockData';
import { categoriesApi, productsApi } from '../utils/api';
import { MapPin, Clock, TrendingUp, Zap, Leaf, Shield, Gift } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Products' }]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const carouselItems = [
    {
      image: 'https://images.unsplash.com/photo-1488459716781-8a84d7acdc43?w=800&h=400&fit=crop',
      title: 'Fresh Produce Delivered',
      description: 'Get organic vegetables and fruits to your doorstep',
    },
    {
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=400&fit=crop',
      title: 'Bakery Fresh Goods',
      description: 'Daily baked products from local bakeries',
    },
    {
      image: 'https://images.unsplash.com/photo-1599599810694-e3eb9896c4b6?w=800&h=400&fit=crop',
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

  useEffect(() => {
    let isMounted = true;

    const loadCatalog = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productsApi.getProducts({ page: 0, size: 80 }),
          categoriesApi.getCategories(),
        ]);

        if (!isMounted) {
          return;
        }

        const fetchedProducts = productsResponse?.content || [];
        const fetchedCategories = categoriesResponse?.content || [];
        const maxPrice = Math.max(
          500,
          ...fetchedProducts.map((product) => Number(product.price) || 0),
        );

        setProducts(fetchedProducts);
        setCategories([{ id: 'all', name: 'All Products' }, ...fetchedCategories]);
        setPriceRange([0, maxPrice]);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || 'Unable to load products right now.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  const maxPrice = useMemo(
    () => Math.max(500, ...products.map((product) => Number(product.price) || 0)),
    [products],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory =
          selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = [product.name, product.description, product.vendor]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesPrice =
          Number(product.price) >= priceRange[0] &&
          Number(product.price) <= priceRange[1];

        return matchesCategory && matchesSearch && matchesPrice;
      }),
    [priceRange, products, searchTerm, selectedCategory],
  );

  const activeCategoryName =
    categories.find((category) => category.id === selectedCategory)?.name ||
    'Featured Products';

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-primary via-orange-400 to-red-400 text-white py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl -bottom-20 -right-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-white bg-opacity-20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold border border-white border-opacity-30">
                  Launch Special: 30% OFF
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Your Local Mart, Delivered Fast
              </h1>

              <p className="text-lg opacity-90 max-w-lg">
                Fresh produce, bakery items, and essentials from trusted local vendors. Delivered to your doorstep in 30-45 minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white border-2 border-white"
                  onClick={() => navigate('/dashboard')}
                >
                  My Orders
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
                src="https://images.unsplash.com/photo-1488459716781-8a84d7acdc43?w=500&h=500&fit=crop"
                alt="Hero"
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

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

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary mb-2">Featured Collections</h2>
            <p className="text-gray-600">Explore our curated selections</p>
          </div>
          <Carousel items={carouselItems} autoPlay={true} interval={6000} />
        </div>
      </section>

      <section className="py-8 px-4 bg-white sticky top-16 z-20 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range: Rs. {priceRange[0]} - Rs. {priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number.parseInt(e.target.value, 10)])
                }
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

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-2">
              <TrendingUp className="text-primary" />
              {selectedCategory === 'all' ? 'Featured Products' : activeCategoryName}
            </h2>
            <p className="text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl">
              <p className="text-gray-500 text-lg font-medium">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl space-y-4">
              <p className="text-red-600 text-lg font-medium">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="transform hover:scale-105 transition-all duration-300">
                  <ProductCard
                    product={product}
                    onViewDetail={() => navigate(`/product/${product.id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-xl">
              <p className="text-gray-500 text-lg font-medium">No products found</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </section>

      <StatsSection />

      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 rounded-2xl p-12 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute w-96 h-96 bg-white rounded-full blur-3xl -top-20 -left-20"></div>
            </div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-4xl font-bold mb-4">Today's Special Offer</h3>
              <p className="text-lg opacity-90 mb-6">
                Get up to 50% OFF on selected items. Limited time offer for new users!
              </p>
              <Button size="lg" variant="ghost" className="text-white border-2 border-white">
                Claim Offer
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about LocalKart</p>
          </div>
          <Accordion items={faqItems} />
        </div>
      </section>

      <Testimonials />

      <section className="py-12 px-4 bg-gradient-to-r from-secondary to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Exclusive Deals First</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get 20% OFF on your first order!
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button size="lg" className="bg-primary hover:bg-orange-600">
              Subscribe
            </Button>
          </div>
          <p className="text-sm opacity-75 mt-4">We respect your privacy. Unsubscribe anytime.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
