import React, { useEffect, useState } from 'react';
import { Package, TrendingUp, Users, DollarSign, Plus, Trash2, LogOut } from 'lucide-react';
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
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'vegetables',
    description: '',
    image: '',
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await vendorApi.addProduct({
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
      });
      setNewProduct({
        name: '',
        price: '',
        stock: '',
        category: 'vegetables',
        description: '',
        image: '',
      });
      setShowAddProduct(false);
      showToast('Product added successfully.', 'success');
      await loadDashboard();
    } catch (error) {
      showToast(error.message || 'Unable to add product.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await vendorApi.deleteProduct(productId);
      showToast('Product removed successfully.', 'success');
      await loadDashboard();
    } catch (error) {
      showToast(error.message || 'Unable to delete product.', 'error');
    }
  };

  const stats = [
    { label: 'Total Products', value: dashboard?.stats?.totalProducts ?? 0, icon: Package, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { label: 'Total Sales', value: `Rs. ${dashboard?.stats?.totalSales ?? 0}`, icon: DollarSign, color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { label: 'Active Orders', value: dashboard?.stats?.activeOrders ?? 0, icon: TrendingUp, color: 'bg-gradient-to-br from-orange-400 to-orange-600' },
    { label: 'Customers', value: dashboard?.stats?.happyCustomers ?? 0, icon: Users, color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{dashboard?.vendor?.shopName || dashboard?.vendor?.name || 'Vendor Dashboard'}</h1>
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

        {isLoading ? (
          <Card className="bg-white p-6">
            <p className="text-gray-600">Loading vendor dashboard...</p>
          </Card>
        ) : null}

        {!isLoading && activeTab === 'products' ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Product Inventory</h2>
              <Button
                variant="primary"
                icon={<Plus className="w-5 h-5" />}
                onClick={() => setShowAddProduct(true)}
              >
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
                    {(dashboard?.products || []).map((product) => (
                      <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        {!isLoading && activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Store Overview</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Shop Name</p>
                  <p className="text-xl font-bold text-gray-900">{dashboard?.vendor?.shopName || dashboard?.vendor?.name}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{dashboard?.vendor?.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{dashboard?.vendor?.phone}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {(dashboard?.orders || []).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">Rs. {order.total}</p>
                      <p className="text-xs text-emerald-600 font-semibold">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : null}

        {!isLoading && activeTab === 'orders' ? (
          <Card className="bg-white p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">All Orders</h3>
            <div className="space-y-4">
              {(dashboard?.orders || []).map((order) => (
                <div key={order.id} className="border-l-4 border-emerald-500 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.items.length} items</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      {order.status}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm font-semibold text-emerald-600">Total: Rs. {order.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>

      {showAddProduct ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g., Fresh Tomatoes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Price</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="45"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
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
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Image URL</label>
                <input
                  type="url"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="https://example.com/product.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition disabled:opacity-60"
                >
                  {isSaving ? 'Saving...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VendorDashboard;
