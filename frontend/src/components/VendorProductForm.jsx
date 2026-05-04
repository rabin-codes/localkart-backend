import React, { useState } from 'react';
import api from '../utils/api';

export const VendorProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    stock: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Local preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let finalImageUrl = '';

      // 1. Upload the image to the backend first if a file is selected
      if (selectedFile) {
        const fileData = new FormData();
        fileData.append('file', selectedFile);

        const uploadRes = await api.post('/api/vendors/products/upload', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        // This is the URL returned by Spring Boot
        finalImageUrl = uploadRes.data.data.imageUrl;
      }

      // 2. Now save the product with the new Image URL
      const productPayload = {
        ...formData,
        imageUrl: finalImageUrl || 'https://picsum.photos/400/300'
      };

      const response = await api.post('/api/vendors/products', productPayload);
      
      if (response.data.status === 'success') {
        alert('Product added successfully!');
        // Reset Form
        setFormData({ name: '', price: '', description: '', categoryId: '', stock: '' });
        setSelectedFile(null);
        setPreviewUrl(null);
        
        if (onProductAdded) onProductAdded(); // Refresh the list
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to add product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-secondary">Add New Product</h2>
      
      {/* Product Name */}
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name
        </label>
        <input 
          id="productName"
          name="name"
          type="text" 
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="e.g. Organic Apples"
          required 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹)
          </label>
          <input 
            id="productPrice"
            name="price"
            type="number" 
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            placeholder="0.00"
            required 
          />
        </div>
        {/* Stock */}
        <div>
          <label htmlFor="productStock" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity
          </label>
          <input 
            id="productStock"
            name="stock"
            type="number" 
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
            placeholder="0"
            required 
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea 
          id="productDescription"
          name="description"
          rows="3"
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Describe your product..."
        />
      </div>

      {/* DEVICE UPLOAD SECTION */}
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center bg-gray-50">
        <label 
          htmlFor="productImage"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Product Image
        </label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
          id="productImage"
          name="productImage"
        />
        <label 
          htmlFor="productImage" 
          className="cursor-pointer bg-secondary text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all inline-block shadow-sm"
        >
          {selectedFile ? 'Change Image' : '📸 Select from Device'}
        </label>
        
        {previewUrl && (
          <div className="mt-4 flex flex-col items-center">
            <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="h-32 w-32 object-cover rounded-lg border-2 border-primary shadow-md" 
            />
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={uploading}
        className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all shadow-lg ${
          uploading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-primary hover:bg-orange-600 active:scale-95'
        }`}
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            Processing...
          </span>
        ) : (
          '🚀 List Product on LocalKart'
        )}
      </button>
    </form>
  );
};