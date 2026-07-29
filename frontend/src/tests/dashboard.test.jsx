import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPage from '../pages/DashboardPage';
import { AuthProvider } from '../context/AuthContext';
import { vehicleApi } from '../api/vehicleApi';

vi.mock('../api/vehicleApi');
vi.mock('../api/authApi');

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('fetches and renders vehicle inventory cards', async () => {
    const mockVehicles = [
      {
        id: 1,
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: '28500.00',
        quantity: 5,
        year: 2024,
      },
      {
        id: 2,
        make: 'Ford',
        model: 'Mustang',
        category: 'Coupe',
        price: '52000.00',
        quantity: 0,
        year: 2023,
      },
    ];

    vehicleApi.getVehicles.mockImplementation(() =>
      Promise.resolve({
        items: mockVehicles,
        total: 2,
        page: 1,
        limit: 12,
      })
    );

    renderWithProviders(<DashboardPage />);

    await waitFor(
      () => {
        expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(screen.getByText(/Ford Mustang/i)).toBeInTheDocument();
    const outOfStockBadges = screen.getAllByText(/Out of Stock/i);
    expect(outOfStockBadges.length).toBeGreaterThan(0);
  });
});
