import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminRoute from '../components/AdminRoute';
import ProtectedRoute from '../components/ProtectedRoute';
import AddVehiclePage from '../pages/AddVehiclePage';
import AdminVehiclesPage from '../pages/AdminVehiclesPage';
import DashboardPage from '../pages/DashboardPage';
import EditVehiclePage from '../pages/EditVehiclePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import RegisterPage from '../pages/RegisterPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Customer & Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Protected Admin Only Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/vehicles" element={<AdminVehiclesPage />} />
        <Route path="/admin/vehicles/new" element={<AddVehiclePage />} />
        <Route path="/admin/vehicles/:id/edit" element={<EditVehiclePage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
