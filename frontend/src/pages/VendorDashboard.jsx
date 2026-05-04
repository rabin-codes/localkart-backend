import React, { useEffect } from 'react';
import { Card, Button, Input, Alert, Loader2 } from '../components';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../components';
import { vendorApi } from '../utils/api';
import { useNotification } from '../context/NotificationContext';

export const VendorDashboard = ({ onLogout, vendorName }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useNotification();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'grocery',
    image: '',
    description: '',
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await vendorApi.getProducts();
      // Handle different response structures: { products: [], ... } or direct array
      setProducts(data.products || (Array.isArray(data) ? data : []));
    } catch (error) {
      showToast('Failed to load your products.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      if (editingId) {
        await vendorApi.updateProduct(editingId, payload);
        showToast('Product updated successfully!', 'success');
      } else {
        await vendorApi.addProduct(payload);
        showToast('Product added successfully!', 'success');
      }
      fetchProducts();
      setFormData({ name: '', price: '', stock: '', category: 'grocery', image: '', description: '' });
      setShowAddForm(false);
      setEditingId(null);
    } catch (error) {
      showToast(error.message || 'Action failed', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await vendorApi.deleteProduct(id);
      showToast('Product deleted', 'success');
      fetchProducts();
    } catch (error) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category?.id || product.category || 'grocery',
      image: product.image,
      description: product.description || '',
    });
    setEditingId(product.id);
    setShowAddForm(true);
  };


  const stats = [
    {
      label: 'Total Products',
      value: products.length.toString(),
      color: 'text-blue-600',
    },
    {
      label: 'Total Stock',
      value: products.reduce((sum, p) => sum + p.stock, 0).toString(),
      color: 'text-green-600',
    },
    {
      label: 'Revenue (This Month)',
      value: '₹' + (products.length * 1000).toString(),
      color: 'text-primary',
    },
    {
      label: 'Orders',
      value: '24',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Vendor Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {vendorName}</p>
          </div>
          <Button variant="danger" onClick={onLogout}>
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Products Section */}
        <Card className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-secondary">Your Products</h2>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus size={18} className="mr-2" />
              Add Product
            </Button>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-secondary">Product</th>
                  <th className="px-4 py-3 text-left font-semibold text-secondary">Price</th>
                  <th className="px-4 py-3 text-left font-semibold text-secondary">Stock</th>
                  <th className="px-4 py-3 text-left font-semibold text-secondary">Category</th>
                  <th className="px-4 py-3 text-right font-semibold text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="font-medium text-secondary">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-primary">₹{product.price}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          product.stock > 50
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{product.category}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setEditingId(null);
          setFormData({ name: '', price: '', stock: '', category: 'vegetables', image: '' });
        }}
        title={editingId ? 'Edit Product' : 'Add New Product'}
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                setFormData({ name: '', price: '', stock: '', category: 'vegetables', image: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>
              {editingId ? 'Update' : 'Add'} Product
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Fresh Tomatoes"
            required
          />

          <Input
            label="Price (₹)"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="e.g., 45"
            required
          />

          <Input
            label="Stock Quantity"
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            placeholder="e.g., 100"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
            >
              <option value="grocery">Grocery & Vegetables</option>
              <option value="electronics">Electronics & Gadgets</option>
              <option value="pharmacy">Pharmacy & Health</option>
              <option value="fashion">Fashion & Apparel</option>
              <option value="food">Food & Restaurant</option>
              <option value="home">Home & Decor</option>
              <option value="sports">Sports & Fitness</option>
              <option value="personal-care">Personal Care</option>
            </select>

          </div>

          <Input
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </Modal>
    </div>
  );
};
