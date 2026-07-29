import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, PlusCircle, Trash2, Wrench } from 'lucide-react';
import { vehicleApi } from '../api/vehicleApi';
import ConfirmDialog from '../components/ConfirmDialog';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/currency';

const AdminVehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [restockingVehicle, setRestockingVehicle] = useState(null);
  const [restockQty, setRestockQty] = useState(5);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleApi.getVehicles(1, 100);
      setVehicles(data.items);
    } catch (err) {
      console.error('Failed to fetch admin vehicles:', err);
      setError('Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleConfirmDelete = async () => {
    if (!deletingVehicle) return;
    try {
      await vehicleApi.deleteVehicle(deletingVehicle.id);
      setDeletingVehicle(null);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to delete vehicle.');
    }
  };

  const handleConfirmRestock = async (e) => {
    e.preventDefault();
    if (!restockingVehicle || restockQty <= 0) return;
    try {
      await vehicleApi.restockVehicle(restockingVehicle.id, parseInt(restockQty));
      setRestockingVehicle(null);
      setRestockQty(5);
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Restock failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">Dealership Inventory Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Add new inventory, update vehicle pricing, restock quantities, or remove records.
          </p>
        </div>
        <Link
          to="/admin/vehicles/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-sky-600/20 transition-all duration-200"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add New Vehicle</span>
        </Link>
      </div>

      <ErrorMessage message={error} onClose={() => setError(null)} />

      {loading ? (
        <LoadingSpinner message="Loading admin inventory records..." />
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-100 flex items-center space-x-3">
                      <img
                        src={v.image_url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=100&q=80'}
                        alt={v.model}
                        className="w-12 h-9 object-cover rounded-lg bg-slate-900"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=100&q=80'; }}
                      />
                      <div>
                        <div>{v.make} {v.model}</div>
                        <div className="text-xs text-slate-500 font-normal">{v.year || 'N/A'} • {v.color || 'Standard'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-semibold text-sky-300 bg-sky-500/10 rounded-full border border-sky-500/20">
                        {v.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-200">{formatCurrency(v.price)}</td>
                    <td className="px-6 py-4">
                      {v.quantity <= 0 ? (
                        <span className="px-2.5 py-1 text-xs font-bold text-rose-400 bg-rose-500/10 rounded-full border border-rose-500/20">
                          Out of Stock (0)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                          In Stock ({v.quantity})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setRestockingVehicle(v)}
                        className="p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-400/10 rounded-lg transition-colors"
                        title="Restock"
                      >
                        <Wrench className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/admin/vehicles/${v.id}/edit`}
                        className="p-2 text-sky-400 hover:text-sky-300 hover:bg-sky-400/10 rounded-lg transition-colors inline-block"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeletingVehicle(v)}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-lg transition-colors"
                        title="Delete"
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
      )}

      {/* Restock Modal */}
      {restockingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100 mb-2">
              Restock {restockingVehicle.make} {restockingVehicle.model}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Current stock level: <strong className="text-white">{restockingVehicle.quantity}</strong> units.
            </p>
            <form onSubmit={handleConfirmRestock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Restock Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm glass-input"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockingVehicle(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-lg shadow-sky-600/20 transition-colors"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingVehicle}
        title="Delete Vehicle"
        message={`Are you sure you want to delete "${deletingVehicle?.make} ${deletingVehicle?.model}"? This action cannot be undone.`}
        confirmText="Delete Vehicle"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingVehicle(null)}
      />
    </div>
  );
};

export default AdminVehiclesPage;
