import React, { useState } from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';

const CATEGORIES = ['All', 'Sedan', 'SUV', 'Coupe', 'Hatchback', 'Truck', 'Electric', 'Hybrid', 'Luxury'];

const SearchFilters = ({ onFilter, onReset }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilter({
      make: make.trim(),
      model: model.trim(),
      category: category === 'All' ? '' : category,
      min_price: minPrice ? parseFloat(minPrice) : '',
      max_price: maxPrice ? parseFloat(maxPrice) : '',
    });
  };

  const handleClear = () => {
    setMake('');
    setModel('');
    setCategory('All');
    setMinPrice('');
    setMaxPrice('');
    onReset();
  };

  return (
    <form onSubmit={handleSearchSubmit} className="glass-card p-6 rounded-2xl mb-8 border border-slate-800">
      <div className="flex items-center space-x-2 mb-4 text-sky-400 font-semibold text-sm">
        <Filter className="w-4 h-4" />
        <span>Filter Inventory</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Make Search */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Make</label>
          <input
            type="text"
            placeholder="e.g. Toyota"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm glass-input"
          />
        </div>

        {/* Model Search */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Model</label>
          <input
            type="text"
            placeholder="e.g. Camry"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm glass-input"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm glass-input bg-slate-900"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Min */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Min Price ($)</label>
          <input
            type="number"
            min="0"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm glass-input"
          />
        </div>

        {/* Price Max */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Max Price ($)</label>
          <input
            type="number"
            min="0"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm glass-input"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={handleClear}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
        <button
          type="submit"
          className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-600/20 transition-all duration-200"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Apply Search</span>
        </button>
      </div>
    </form>
  );
};

export default SearchFilters;
