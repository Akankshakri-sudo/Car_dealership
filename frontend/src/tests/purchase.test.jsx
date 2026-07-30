import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPage from '../pages/DashboardPage';
import { AuthProvider } from '../context/AuthContext';
import { vehicleApi } from '../api/vehicleApi';
import { authApi } from '../api/authApi';

vi.mock('../api/vehicleApi');
vi.mock('../api/authApi');

const renderWithProviders = (ui) => {
  localStorage.setItem('token', 'test-token');
  authApi.getCurrentUser.mockResolvedValue({
    id: 1,
    full_name: 'Customer Akanksha',
    email: 'akanksha@example.com',
    role: 'customer',
  });

  return render(
    <AuthProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
};

describe('Vehicle Purchase Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('handles vehicle purchase request and updates stock quantity', async () => {
    const mockVehicle = {
      id: 1,
      make: 'Honda',
      model: 'Civic',
      category: 'Sedan',
      price: '24000.00',
      quantity: 2,
      year: 2024,
    };

    vehicleApi.getVehicles.mockResolvedValue({
      items: [mockVehicle],
      total: 1,
      page: 1,
      limit: 12,
    });

    vehicleApi.purchaseVehicle.mockResolvedValue({
      message: 'Vehicle purchased successfully',
      vehicle_id: 1,
      remaining_quantity: 1,
    });

    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    });

    const purchaseBtn = screen.getByRole('button', { name: /Purchase Vehicle/i });
    fireEvent.click(purchaseBtn);

    await waitFor(() => {
      expect(vehicleApi.purchaseVehicle).toHaveBeenCalledWith(1, 1);
    });
  });

  it('displays error notification when purchase fails due to out-of-stock conflict', async () => {
    const mockVehicle = {
      id: 2,
      make: 'Mazda',
      model: 'CX-5',
      category: 'SUV',
      price: '31000.00',
      quantity: 1,
      year: 2023,
    };

    vehicleApi.getVehicles.mockResolvedValue({
      items: [mockVehicle],
      total: 1,
      page: 1,
      limit: 12,
    });

    const apiError = new Error('Insufficient stock available');
    apiError.response = { data: { error: { message: 'Insufficient stock available' } } };
    vehicleApi.purchaseVehicle.mockRejectedValue(apiError);

    renderWithProviders(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Mazda CX-5')).toBeInTheDocument();
    });

    const purchaseBtn = screen.getByRole('button', { name: /Purchase Vehicle/i });
    fireEvent.click(purchaseBtn);

    await waitFor(() => {
      expect(screen.getByText(/Insufficient stock available/i)).toBeInTheDocument();
    });
  });
});
