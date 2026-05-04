import React, { useEffect, useRef, useState } from 'react';
import { Package, TrendingUp, Users, DollarSign, Plus, Trash2, LogOut, Upload, X, Image } from 'lucide-react';
import { Button, Card } from '../components';
import { useNotification } from '../context/NotificationContext';
import { vendorApi } from '../utils/api';

export const VendorDashboard = ({ onLogout }) => {
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Image upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'vegetables',
    description: '',
  });

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await vendorApi.getDashboard();
      setDashboard(response);
    } catch (error) {
      showToast(error.message || 'Unable to load vendor dashboard.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ── File selection handler ──────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type & size (max 5 MB)
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be smaller than 5 MB.', 'error');
      return;
    }

    setSelectedFile(file);
    // Create a local object-URL for instant preview
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit handler ──────────────────────────────────────
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = '';

      // 1. Upload image first if a file was selected
      if (selectedFile) {
        try {
          const uploadResult = await vendorApi.uploadProductImage(selectedFile);
          // uploadResult is already the data payload (imageUrl string or object)
          if (typeof uploadResult === 'string') {
            imageUrl = uploadResult;
          } else {
            imageUrl = uploadResult?.imageUrl || '';
          }
        } catch (uploadError) {
          showToast('Image upload failed: ' + (uploadError.message || 'Unknown error'), 'error');
          setIsSaving(false);
          return;
        }
      }

      // 2. Save product with the returned image URL
      await vendorApi.addProduct({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        imageUrl: imageUrl || 'https://picsum.photos/seed/' + newProduct.name + '/400/300',
        image:    imageUrl || 'https://picsum.photos/seed/' + newProduct.name + '/400/300',
      });

      // Reset form
      setNewProduct({ name: '', price: '', stock: '', category: 'vegetables', description: '' });
      handleRemoveImage();
      setShowAddProduct(false);
      showToast('Product added successfully! 🎉', 'success');
      await loadDashboard();
    } catch (error) {
      showToast(error.message || 'Unable to add product.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await vendorApi.deleteProduct(productId);
      showToast('Product removed successfully.', 'success');
      await loadDashboard();
    } catch (error) {
      showToast(error.message || 'Unable to delete product.', 'error');
    }
  };

  // Helper to resolve product image URLs
  const resolveImage = (product) => {
    const src = product.imageUrl || product.image;
    if (!src) return `https://picsum.photos/seed/${product.id}/400/300`;
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    return `/uploads/${src}`;
  };

  const stats = [
    { label: 'Total Products', value: dashboard?.stats?.totalProducts ?? 0, icon: Package,    color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { label: 'Total Sales',    value: `Rs. ${dashboard?.stats?.totalSales ?? 0}`,  icon: DollarSign, color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { label: 'Active Orders',  value: dashboard?.stats?.activeOrders ?? 0,         icon: TrendingUp, color: 'bg-gradient-to-br from-orange-400 to-orange-600' },
    { label: 'Customers',      value: dashboard?.stats?.happyCustomers ?? 0,       icon: Users,      color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {dashboard?.vendor?.shopName || dashboard?.vendor?.name || 'Vendor Dashboard'}
              </h1>
              <p className="text-emerald-100 text-sm">Vendor Dashboard</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:scale-105 transition duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white w-6 h-6" />
                  </div>
                  <TrendingUp className="text-green-500 w-5 h-5" />
                </div>
                <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-600">
          {['dashboard', 'products', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold transition ${
                activeTab === tab
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {isLoading && (
          <Card className="bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600">Loading vendor dashboard...</p>
            </div>
          </Card>
        )}

        {/* Products Tab */}
        {!isLoading && activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Product Inventory</h2>
              <Button
                variant="primary"
                onClick={() => setShowAddProduct(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Product</th>
                      <th className="px-6 py-4 text-left font-semibold">Price</th>
                      <th className="px-6 py-4 text-left font-semibold">Stock</th>
                      <th className="px-6 py-4 text-left font-semibold">Category</th>
                      <th className="px-6 py-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dashboard?.products || []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-400">
                          No products yet. Click "Add Product" to get started!
                        </td>
                      </tr>
                    ) : (
                      (dashboard?.products || []).map((product) => (
                        <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={resolveImage(product)}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                                onError={(e) => {
                                  e.target.src = `https://picsum.photos/seed/${product.id}/48/48`;
                                }}
                              />
                              <span className="font-semibold text-gray-900">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-900 font-semibold">Rs. {product.price}</td>
                          <td className="px-6 py-4 text-gray-900">{product.stock} units</td>
                          <td className="px-6 py-4 text-gray-900 capitalize">{product.category}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {!isLoading && activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Store Overview</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Shop Name</p>
                  <p className="text-xl font-bold text-gray-900">
                    {dashboard?.vendor?.shopName || dashboard?.vendor?.name}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{dashboard?.vendor?.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{dashboard?.vendor?.phone || '—'}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {(dashboard?.orders || []).length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No orders yet</p>
                ) : (
                  (dashboard?.orders || []).slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{order.items?.length ?? 0} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">Rs. {order.total}</p>
                        <p className="text-xs text-emerald-600 font-semibold">{order.status}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {!isLoading && activeTab === 'orders' && (
          <Card className="bg-white p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">All Orders</h3>
            <div className="space-y-4">
              {(dashboard?.orders || []).length === 0 ? (
                <p className="text-gray-400 text-center py-8">No orders yet</p>
              ) : (
                (dashboard?.orders || []).map((order) => (
                  <div key={order.id} className="border-l-4 border-emerald-500 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.items?.length ?? 0} items</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        {order.status}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm font-semibold text-emerald-600">Total: Rs. {order.total}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
      </div>

      {/* ── Add Product Modal ──────────────────────────────── */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 my-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
              <button
                onClick={() => { setShowAddProduct(false); handleRemoveImage(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Product Name *</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g., Fresh Tomatoes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Price / Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Price (Rs.) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="45"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Stock Qty *</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="vegetables">Vegetables</option>
                  <option value="bakery">Bakery</option>
                  <option value="dairy">Dairy</option>
                  <option value="beverages">Beverages</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains & Pulses</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows="2"
                  placeholder="Describe your product..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* ── IMAGE UPLOAD (file from device) ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Product Image <span className="font-normal text-gray-500">(upload from your device)</span>
                </label>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="vendorProductImg"
                />

                {!previewUrl ? (
                  /* Drop-zone / click to upload */
                  <label
                    htmlFor="vendorProductImg"
                    className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-emerald-400 rounded-xl cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition group"
                  >
                    <Upload className="w-8 h-8 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-semibold text-emerald-700">Click to upload image</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 5 MB</span>
                  </label>
                ) : (
                  /* Preview */
                  <div className="relative rounded-xl overflow-hidden border-2 border-emerald-400 h-40">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition flex items-center justify-center">
                      <label
                        htmlFor="vendorProductImg"
                        className="cursor-pointer bg-white bg-opacity-90 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow hover:bg-opacity-100"
                      >
                        Change Image
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedFile && (
                  <p className="text-xs text-gray-500 mt-1">
                    <Image className="inline w-3 h-3 mr-1" />
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddProduct(false); handleRemoveImage(); }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {selectedFile ? 'Uploading...' : 'Saving...'}
                    </>
                  ) : (
                    '🚀 Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
