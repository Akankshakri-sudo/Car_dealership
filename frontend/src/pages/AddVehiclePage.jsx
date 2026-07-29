import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car } from 'lucide-react';
import { vehicleApi } from '../api/vehicleApi';
import ErrorMessage from '../components/ErrorMessage';

const AddVehiclePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: 'Sedan',
    price: '',
    quantity: '5',
    year: new Date().getFullYear().toString(),
    color: '',
    image_url: '',
    description: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.make.trim() || !formData.model.trim()) {
      setError('Make and Model are required.');
      return;
    }

    const numericPrice = parseFloat(formData.price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setError('Price must be greater than zero.');
      return;
    }

    const numericQty = parseInt(formData.quantity);
    if (isNaN(numericQty) || numericQty < 0) {
      setError('Quantity must be zero or greater.');
      return;
    }

    setLoading(true);
    try {
      await vehicleApi.createVehicle({
        make: formData.make.trim(),
        model: formData.model.trim(),
        category: formData.category,
        price: numericPrice,
        quantity: numericQty,
        year: formData.year ? parseInt(formData.year) : null,
        color: formData.color.trim() || null,
        image_url: formData.image_url.trim() || null,
        description: formData.description.trim() || null,
      });

      navigate('/admin/vehicles');
    } catch (err) {
      console.error('Failed to create vehicle:', err);
      setError(err.response?.data?.error?.message || 'Failed to create vehicle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <button
        onClick={() => navigate('/admin/vehicles')}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Vehicle Management</span>
      </button>

      <div className="glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-sky-600/20 text-sky-400 rounded-2xl border border-sky-500/30">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Add New Vehicle</h1>
            <p className="text-xs text-slate-400">Enter vehicle specification details to update dealership inventory.</p>
          </div>
        </div>

        <ErrorMessage message={error} onClose={() => setError(null)} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Make */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Make *
              </label>
              <input
                type="text"
                name="make"
                placeholder="e.g. Toyota"
                value={formData.make}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                required
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Model *
              </label>
              <input
                type="text"
                name="model"
                placeholder="e.g. Camry"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm glass-input bg-slate-900"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Truck">Truck</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="price"
                placeholder="28500.00"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                required
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Quantity *
              </label>
              <input
                type="number"
                min="0"
                name="quantity"
                placeholder="5"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
                required
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Year
              </label>
              <input
                type="number"
                name="year"
                placeholder="2024"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Color
              </label>
              <input
                type="text"
                name="color"
                placeholder="e.g. Midnight Black"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              placeholder="Detailed description of the vehicle specifications and features..."
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl text-sm glass-input"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/admin/vehicles')}
              className="px-5 py-2.5 text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg shadow-sky-600/20 transition-all duration-200"
            >
              {loading ? 'Creating...' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehiclePage;
