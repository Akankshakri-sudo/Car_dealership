import React, { useState } from 'react';
import { Calendar, CheckCircle2, Edit3, Fuel, ShoppingBag, Trash2, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';

const VehicleCard = ({
  vehicle,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}) => {
  const { isAdmin } = useAuth();
  const [purchasing, setPurchasing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const isOutOfStock = vehicle.quantity <= 0;

  const handlePurchase = async () => {
    if (isOutOfStock || purchasing) return;
    setPurchasing(true);
    setSuccessMessage(null);

    try {
      await onPurchase(vehicle.id, 1);
      setSuccessMessage('Purchased successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Purchase failed:', err);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col group">
      {/* Image Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={vehicle.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-300 bg-slate-900/80 backdrop-blur-md rounded-full border border-sky-500/30">
            {vehicle.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 backdrop-blur-md rounded-full border border-rose-500/40">
              Out of Stock
            </span>
          ) : (
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 backdrop-blur-md rounded-full border border-emerald-500/40">
              {vehicle.quantity} Available
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-sky-400 transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="text-xl font-extrabold text-white">
              {formatCurrency(vehicle.price)}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-400 mb-3">
            {vehicle.year && (
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{vehicle.year}</span>
              </span>
            )}
            {vehicle.color && (
              <span className="flex items-center space-x-1">
                <Fuel className="w-3.5 h-3.5 text-slate-500" />
                <span>{vehicle.color}</span>
              </span>
            )}
          </div>

          {vehicle.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {vehicle.description}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
          {successMessage && (
            <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 py-1.5 rounded-lg border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={isOutOfStock || purchasing}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : purchasing
                ? 'bg-sky-700 text-slate-300 cursor-wait'
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-sky-500/20 hover:scale-[1.02]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'Out of Stock' : purchasing ? 'Processing...' : 'Purchase Vehicle'}</span>
          </button>

          {/* Admin Management Buttons */}
          {isAdmin && (
            <div className="flex items-center space-x-2 pt-2">
              {onRestock && (
                <button
                  onClick={() => onRestock(vehicle)}
                  title="Restock Inventory"
                  className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 font-medium text-xs rounded-lg border border-slate-700 flex items-center justify-center space-x-1 transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Restock</span>
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(vehicle)}
                  title="Edit Vehicle"
                  className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 font-medium text-xs rounded-lg border border-slate-700 flex items-center justify-center space-x-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(vehicle)}
                  title="Delete Vehicle"
                  className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg border border-slate-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
