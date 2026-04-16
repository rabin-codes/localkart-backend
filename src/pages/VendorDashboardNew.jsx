import React, { useState } from 'react';
import { Package, TrendingUp, Users, DollarSign, Plus, Edit2, Trash2, ChevronDown, LogOut } from 'lucide-react';
import { Button, Card } from '../components';
import { useNavigate } from 'react-router-dom';

export const VendorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: 'Fresh Tomatoes', price: 45, stock: 120, image: 'https://images.unsplash.com/photo-1592921570552-8ac41e632de0?w=100&h=100&fit=crop', status: 'Active', sold: 245 },
    { id: 2, name: 'Bell Peppers', price: 65, stock: 200, image: 'https://images.unsplash.com/photo-1599599810694-e3eb9896c4b6?w=100&h=100&fit=crop', status: 'Active', sold: 180 },
    { id: 3, name: 'Spinach Bundle', price: 25, stock: 50, image: 'https://images.unsplash.com/photo-1599599810997-d2891498c2d7?w=100&h=100&fit=crop', status: 'Low Stock', sold: 89 },
    { id: 4, name: 'Organic Carrots', price: 35, stock: 150, image: 'https://images.unsplash.com/photo-1599599810988-87242628b4e4?w=100&h=100&fit=crop', status: 'Active', sold: 156 },
    { id: 5, name: 'Fresh Onions', price: 30, stock: 220, image: 'https://images.unsplash.com/photo-1599599810988-87242628b4e4?w=100&h=100&fit=crop', status: 'Active', sold: 234 },
    { id: 6, name: 'Green Beans', price: 55, stock: 80, image: 'https://images.unsplash.com/photo-1599599810988-87242628b4e4?w=100&h=100&fit=crop', status: 'Active', sold: 123 },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'vegetables',
  });

  const stats = [
    { label: 'Total Products', value: 6, icon: Package, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { label: 'Total Sales', value: '₹45,320', icon: DollarSign, color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { label: 'Active Orders', value: '28', icon: TrendingUp, color: 'bg-gradient-to-br from-orange-400 to-orange-600' },
    { label: 'Happy Customers', value: '342', icon: Users, color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
  ];

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.stock) {
      setProducts([
        ...products,
        {
          id: products.length + 1,
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          image: `https://via.placeholder.com/100?text=${newProduct.name}`,
          status: parseInt(newProduct.stock) > 50 ? 'Active' : 'Low Stock',
        },
      ]);
      setNewProduct({ name: '', price: '', stock: '', category: 'vegetables' });
      setShowAddProduct(false);
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleLogout = () => {
    navigate('/vendor-login');
  };

  const getImageFallback = (url, productName) => {
    if (!url) {
      return `https://via.placeholder.com/100?text=${productName.substring(0, 10)}`;
    }
    return url;
  };

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
              <h1 className="text-2xl font-bold">Fresh Valley</h1>
              <p className="text-emerald-100 text-sm">Vendor Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
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
          {['dashboard', 'products', 'orders', 'analytics'].map((tab) => (
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

        {/* Products Tab */}
        {activeTab === 'products' && (
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

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Product</th>
                      <th className="px-6 py-4 text-left font-semibold">Price</th>
                      <th className="px-6 py-4 text-left font-semibold">Stock</th>
                      <th className="px-6 py-4 text-left font-semibold">Sold</th>
                      <th className="px-6 py-4 text-left font-semibold">Status</th>
                      <th className="px-6 py-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={getImageFallback(product.image, product.name)}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/50?text=${product.name.substring(0, 3)}`;
                              }}
                            />
                            <span className="font-semibold text-gray-900">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-semibold">₹{product.price}</td>
                        <td className="px-6 py-4 text-gray-900">{product.stock} units</td>
                        <td className="px-6 py-4 text-gray-900 font-semibold text-green-600">{product.sold}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              product.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
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
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Monthly Revenue</h3>
              <div className="space-y-3">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="w-12 font-semibold text-gray-600">{month}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
                        style={{ width: `${(idx + 1) * 15}%` }}
                      ></div>
                    </div>
                    <span className="w-16 text-right font-semibold text-gray-900">
                      ₹{(idx + 1) * 5000}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {[
                  { id: 'ORD001', customer: 'Priya Sharma', amount: '₹450', status: 'Delivered', time: '2 mins ago' },
                  { id: 'ORD002', customer: 'Rajesh Kumar', amount: '₹320', status: 'Processing', time: '15 mins ago' },
                  { id: 'ORD003', customer: 'Anjali Patel', amount: '₹680', status: 'Pending', time: '1 hour ago' },
                  { id: 'ORD004', customer: 'Vikram Singh', amount: '₹520', status: 'Delivered', time: '2 hours ago' },
                  { id: 'ORD005', customer: 'Meera Gupta', amount: '₹385', status: 'Processing', time: '3 hours ago' },
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div>
                      <p className="font-semibold text-gray-900">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.id} • {order.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{order.amount}</p>
                      <p
                        className={`text-xs font-semibold ${
                          order.status === 'Delivered'
                            ? 'text-green-600'
                            : order.status === 'Processing'
                            ? 'text-blue-600'
                            : 'text-orange-600'
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card className="bg-white p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">All Orders</h3>
            <div className="space-y-4">
              {[
                { id: 'ORD001', customer: 'John Doe', items: 5, amount: 200, date: '2024-04-14', status: 'Delivered', rating: 5 },
                { id: 'ORD002', customer: 'Jane Smith', items: 3, amount: 150, date: '2024-04-13', status: 'Processing', rating: 0 },
                { id: 'ORD003', customer: 'Mike Wilson', items: 7, amount: 350, date: '2024-04-13', status: 'Delivered', rating: 4 },
                { id: 'ORD004', customer: 'Sarah Johnson', items: 4, amount: 180, date: '2024-04-12', status: 'Delivered', rating: 5 },
                { id: 'ORD005', customer: 'David Brown', items: 6, amount: 280, date: '2024-04-12', status: 'Cancelled', rating: 0 },
              ].map((order) => (
                <div key={order.id} className="border-l-4 border-emerald-500 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{order.id} - {order.customer}</p>
                      <p className="text-sm text-gray-600">Date: {order.date} | {order.items} items</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <p className="text-sm font-semibold text-emerald-600">Total: ₹{order.amount}</p>
                    {order.rating > 0 && <span className="text-yellow-500">{'★'.repeat(order.rating)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Top Products</h3>
              <div className="space-y-3">
                {[
                  { name: 'Fresh Tomatoes', sold: 320, revenue: '₹14,400', trend: '+15%' },
                  { name: 'Bell Peppers', sold: 280, revenue: '₹18,200', trend: '+12%' },
                  { name: 'Green Beans', sold: 245, revenue: '₹13,475', trend: '+8%' },
                  { name: 'Organic Carrots', sold: 200, revenue: '₹7,000', trend: '+5%' },
                ].map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg hover:shadow-md transition">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.sold} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{product.revenue}</p>
                      <p className="text-xs text-green-600 font-semibold">{product.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-white p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Avg Order Value', value: '₹487', benchmark: 'vs ₹420' },
                  { label: 'Customer Satisfaction', value: '4.8/5', benchmark: 'vs 4.5' },
                  { label: 'On-time Delivery', value: '99%', benchmark: 'vs 98%' },
                  { label: 'Return Rate', value: '0.8%', benchmark: 'vs 2%' },
                  { label: 'Product Freshness Rating', value: '4.9/5', benchmark: 'Excellent' },
                ].map((metric, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border-b border-gray-200 hover:bg-gray-50 rounded-lg transition">
                    <div>
                      <p className="text-gray-700 font-semibold">{metric.label}</p>
                      <p className="text-xs text-gray-500">{metric.benchmark}</p>
                    </div>
                    <p className="text-lg font-bold text-emerald-600">{metric.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
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
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Price (₹)</label>
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
