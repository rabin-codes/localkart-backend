import React from 'react';
import { Card, Button, Input, Alert } from '../components';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../components';

export const VendorDashboard = ({ onLogout, vendorName }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Fresh Tomatoes',
      price: 45,
      stock: 120,
      category: 'vegetables',
      image: 'https://images.unsplash.com/photo-1592921570552-8ac41e632de0?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Whole Wheat Bread',
      price: 35,
      stock: 80,
      category: 'bakery',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'vegetables',
    image: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = () => {
    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...formData, id: editingId } : p
        )
      );
      setEditingId(null);
    } else {
      const newProduct = {
        ...formData,
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    setFormData({ name: '', price: '', stock: '', category: 'vegetables', image: '' });
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditProduct = (product) => {
    setFormData(product);
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
              className="input-field"
            >
              <option value="vegetables">Vegetables</option>
              <option value="dairy">Dairy & Eggs</option>
              <option value="bakery">Bakery</option>
              <option value="beverages">Beverages</option>
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
