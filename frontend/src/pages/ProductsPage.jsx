import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, ArrowLeft, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, Badge, ProductCard } from '../components';
import { productsApi, categoriesApi } from '../utils/api';

import { useNotification } from '../context/NotificationContext';

export const ProductsPage = () => {
    const navigate = useNavigate();
    const { showToast } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(5000);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [prodData, catData] = await Promise.all([
                productsApi.getProducts({ size: 100 }),
                categoriesApi.getCategories()
            ]);

            
            setProducts(prodData.products || prodData || []);
            
            const catNames = (catData.content || catData || []).map(c => c.name);
            setCategories(['All', ...catNames]);
        } catch (error) {
            showToast('Error fetching data.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'All' || 
            p.categoryName === selectedCategory;
        
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesPrice = p.price <= priceRange;
        
        return matchesCategory && matchesSearch && matchesPrice;
    });


    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Unique Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 px-4 md:px-8 lg:px-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-orange-100 hover:text-white transition mb-6 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Discover Local Freshness</h1>
                    <p className="text-orange-100 text-lg max-w-2xl">
                        Handpicked quality products from your favorite local vendors, delivered in less than 45 minutes.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Unique Filter Sidebar */}
                    <aside className="w-full lg:w-72 space-y-8">
                        {/* Search */}
                        <Card className="p-6 shadow-sm border-none bg-white/80 backdrop-blur-md">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Search className="w-4 h-4 text-orange-500" /> Search
                            </h3>
                            <Input 
                                placeholder="What are you looking for?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-gray-50 border-none focus:ring-orange-500"
                            />
                        </Card>

                        {/* Categories */}
                        <Card className="p-6 shadow-sm border-none bg-white/80 backdrop-blur-md">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Filter className="w-4 h-4 text-orange-500" /> Categories
                            </h3>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                            selectedCategory === cat 
                                            ? 'bg-orange-500 text-white shadow-md' 
                                            : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Price Range */}
                        <Card className="p-6 shadow-sm border-none bg-white/80 backdrop-blur-md">
                            <h3 className="font-bold text-gray-800 mb-4">Max Price: ₹{priceRange}</h3>
                            <input 
                                type="range" 
                                min="0" 
                                max="2000" 
                                step="50"
                                value={priceRange}
                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                className="w-full accent-orange-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>₹0</span>
                                <span>₹2000</span>
                            </div>
                        </Card>
                    </aside>

                    {/* Main Products Grid */}
                    <main className="flex-1">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-32">
                                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500 font-medium">Loading products...</p>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">

                                {filteredProducts.map(product => (
                                    <div key={product.id} className="group relative">
                                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                                <Heart className="w-5 h-5" />
                                            </button>
                                            <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
                                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-10 h-10 text-orange-200" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No products found</h3>
                                <p className="text-gray-500 mb-8">Try adjusting your filters or search query to find what you're looking for.</p>
                                <Button 
                                    variant="primary" 
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All');
                                        setPriceRange(2000);
                                    }}
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};
