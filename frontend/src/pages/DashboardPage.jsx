import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleApi } from '../api/vehicleApi';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchFilters from '../components/SearchFilters';
import VehicleCard from '../components/VehicleCard';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchParams, setSearchParams] = useState(null);

  // Deletion state
  const [deletingVehicle, setDeletingVehicle] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (searchActive && searchParams) {
        const results = await vehicleApi.searchVehicles({ ...searchParams, page });
        setVehicles(results);
        setTotal(results.length);
      } else {
        const data = await vehicleApi.getVehicles(page, 12);
        setVehicles(data.items);
        setTotal(data.total);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
      const msg = err.response?.data?.error?.message || 'Failed to load vehicle catalog.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, searchActive, searchParams]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleFilter = (filters) => {
    setSearchParams(filters);
    setSearchActive(true);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchParams(null);
    setSearchActive(false);
    setPage(1);
  };

  const handlePurchase = async (vehicleId, quantity) => {
    try {
      const response = await vehicleApi.purchaseVehicle(vehicleId, quantity);
      // Update local vehicle state with new remaining quantity
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId ? { ...v, quantity: response.remaining_quantity } : v
        )
      );
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Purchase failed.';
      setError(msg);
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingVehicle) return;
    try {
      await vehicleApi.deleteVehicle(deletingVehicle.id);
      setDeletingVehicle(null);
      fetchVehicles();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to delete vehicle.';
      setError(msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Banner */}
      <div className="mb-8 p-8 glass-card rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-3xl font-extrabold text-slate-100 sm:text-4xl">
          AutoApex Inventory Catalog
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl">
          Browse available vehicles, check real-time stock levels, filter by make, category or price, and complete purchases instantly.
        </p>
      </div>

      <ErrorMessage message={error} onClose={() => setError(null)} />

      {/* Search & Filter Component */}
      <SearchFilters onFilter={handleFilter} onReset={handleResetFilters} />

      {/* Main Content Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching dealership inventory..." />
      ) : vehicles.length === 0 ? (
        <EmptyState
          title={searchActive ? 'No Vehicles Match Your Search' : 'No Vehicles Available'}
          description={
            searchActive
              ? 'Try relaxing your search parameters or price thresholds.'
              : 'Check back later as our inventory is frequently restocked.'
          }
          onReset={searchActive ? handleResetFilters : null}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                onPurchase={handlePurchase}
                onEdit={(veh) => navigate(`/admin/vehicles/${veh.id}/edit`)}
                onDelete={(veh) => setDeletingVehicle(veh)}
                onRestock={() => navigate('/admin/vehicles')}
              />
            ))}
          </div>

          {/* Pagination */}
          {!searchActive && total > 12 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Showing {vehicles.length} of {total} vehicles
              </span>
              <div className="flex space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 text-xs font-semibold rounded-lg glass-card border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={page * 12 >= total}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg glass-card border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingVehicle}
        title="Delete Vehicle"
        message={`Are you sure you want to delete "${deletingVehicle?.make} ${deletingVehicle?.model}" from dealership inventory? This action cannot be undone.`}
        confirmText="Delete Vehicle"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingVehicle(null)}
      />
    </div>
  );
};

export default DashboardPage;
