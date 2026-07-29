import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { vehicleApi } from '../api/vehicleApi';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const EditVehiclePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: 'Sedan',
    price: '',
    quantity: '0',
    year: '',
    color: '',
    image_url: '',
    description: '',
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await vehicleApi.getVehicleById(id);
        setFormData({
          make: data.make,
          model: data.model,
          category: data.category,
          price: data.price.toString(),
          quantity: data.quantity.toString(),
          year: data.year ? data.year.toString() : '',
          color: data.color || '',
          image_url: data.image_url || '',
          description: data.description || '',
        });
      } catch (err) {
        console.error('Failed to fetch vehicle:', err);
        setError('Failed to load vehicle details.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

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
      await vehicleApi.updateVehicle(id, {
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
      console.error('Failed to update vehicle:', err);
      setError(err.response?.data?.error?.message || 'Failed to update vehicle.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner message="Loading vehicle details..." />;
  }

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
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Edit Vehicle</h1>
            <p className="text-xs text-slate-400">Update vehicle record specification and inventory details.</p>
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
              {loading ? 'Updating...' : 'Update Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehiclePage;
