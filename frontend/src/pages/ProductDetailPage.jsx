import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, ShoppingCart, ArrowLeft, Truck, Shield, Clock, Loader2 } from 'lucide-react';
import { Button, Card, ProductGallery, RatingComponent, Badge } from '../components';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/NotificationContext';
import { productsApi } from '../utils/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const foundProduct = await productsApi.getById(id);
        if (foundProduct) {
          setProduct(foundProduct);
          // Fetch related products (same category)
          const categoryId = foundProduct.category?.id || foundProduct.category;
          if (categoryId) {
            const related = await productsApi.getByCategory(categoryId);
            setRelatedProducts((related.products || related || []).filter(p => p.id !== parseInt(id)).slice(0, 4));
          }
        } else {
          showNotification('Product not found', 'error');
          navigate('/home');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        showNotification('Failed to load product details.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate, showNotification]);


  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });
      showNotification(`${quantity}x ${product.name} added to cart!`, 'success');
      setQuantity(1);
    }
  };

  const handleShare = () => {
    showNotification('Product link copied to clipboard!', 'success');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showNotification(
      isFavorite ? 'Removed from favorites' : 'Added to favorites',
      'info'
    );
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <div className="w-12"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Product Gallery */}
          <div className="lg:col-span-2">
            <ProductGallery product={product} discount={discount} />
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Title and Rating */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
                  <div className="flex items-center gap-2">
                    <RatingComponent rating={product.rating} size="md" />
                    <span className="text-gray-600">({product.reviews} reviews)</span>
                  </div>
                </div>
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full transition ${
                    isFavorite
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className="w-6 h-6 fill-current" />
                </button>
              </div>
            </div>

            {/* Price Section */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
              <div className="space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <Badge variant="success">Save ₹{product.originalPrice - product.price}</Badge>
                    </>
                  )}
                </div>
                {discount > 0 && (
                  <Badge variant="danger">{discount}% OFF</Badge>
                )}
              </div>
            </Card>

            {/* Vendor Info */}
            <Card className="border border-gray-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sold by</span>
                  <a href="#" className="font-semibold text-orange-600 hover:text-orange-700">
                    {product.vendor}
                    {product.vendorVerified && ' ✓'}
                  </a>
                </div>
                <div className="text-sm text-gray-500">
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-semibold">{product.stock} in stock</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Out of stock</span>
                  )}
                </div>
              </div>
            </Card>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Why Buy From LocalKart?
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>Delivery in 30-45 minutes</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <Truck className="w-4 h-4 text-orange-500" />
                  <span>Free delivery on orders above ₹500</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <Shield className="w-4 h-4 text-orange-500" />
                  <span>30-day money-back guarantee</span>
                </li>
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                >
                  −
                </button>
                <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-500">Available: {product.stock} items</p>
            </div>

            {/* Add to Cart Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              icon={<ShoppingCart className="w-5 h-5" />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            {/* Share Button */}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              icon={<Share2 className="w-5 h-5" />}
              onClick={handleShare}
            >
              Share Product
            </Button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {['details', 'reviews', 'shipping'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 font-semibold transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-orange-500 text-orange-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Details</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold text-gray-900 capitalize">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vendor</p>
                    <p className="font-semibold text-gray-900">{product.vendor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Stock</p>
                    <p className="font-semibold text-gray-900">{product.stock} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Freshness</p>
                    <p className="font-semibold text-green-600">Farm Fresh</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">{product.rating}</span>
                    <span className="text-gray-600">out of 5</span>
                  </div>
                  <RatingComponent rating={product.rating} size="lg" />
                  <p className="text-gray-600 mt-2">Based on {product.reviews} reviews</p>
                </div>
                <p className="text-gray-600 text-center py-6">
                  Reviews will be loaded when you purchase this product
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Shipping Information</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Truck className="w-6 h-6 text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Super Fast Delivery</p>
                      <p className="text-gray-600">Your order will be delivered in 30-45 minutes</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Quality Assured</p>
                      <p className="text-gray-600">Every product is carefully selected and checked</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">30-Day Guarantee</p>
                      <p className="text-gray-600">Not satisfied? Money back within 30 days</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
                <Card
                  key={relatedProduct.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-orange-600">₹{relatedProduct.price}</span>
                    <RatingComponent rating={relatedProduct.rating} size="sm" />
                  </div>
                </Card>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
