import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminVehiclesPage from '../pages/AdminVehiclesPage';
import { AuthProvider } from '../context/AuthContext';
import { vehicleApi } from '../api/vehicleApi';
import { authApi } from '../api/authApi';

vi.mock('../api/vehicleApi');
vi.mock('../api/authApi');

const renderWithProviders = (ui) => {
  localStorage.setItem('token', 'admin-token');
  authApi.getCurrentUser.mockResolvedValue({
    id: 1,
    full_name: 'Admin Akanksha',
    email: 'admin@example.com',
    role: 'admin',
  });

  return render(
    <AuthProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
};

describe('AdminVehiclesPage Integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('renders admin vehicle inventory table and header controls', async () => {
    const mockVehicles = [
      {
        id: 1,
        make: 'Porsche',
        model: '911 Carrera',
        category: 'Sports',
        price: '114000.00',
        quantity: 2,
        year: 2024,
      },
    ];

    vehicleApi.getVehicles.mockResolvedValue({
      items: mockVehicles,
      total: 1,
    });

    renderWithProviders(<AdminVehiclesPage />);

    await waitFor(() => {
      expect(screen.getByText('Dealership Inventory Management')).toBeInTheDocument();
    });

    expect(screen.getByText('Porsche 911 Carrera')).toBeInTheDocument();
    expect(screen.getByText('$114,000.00')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Add New Vehicle/i })).toBeInTheDocument();
  });

  it('opens confirmation modal and executes delete on confirm', async () => {
    const mockVehicle = {
      id: 1,
      make: 'Chevrolet',
      model: 'Tahoe',
      category: 'SUV',
      price: '58000.00',
      quantity: 4,
      year: 2023,
    };

    vehicleApi.getVehicles.mockResolvedValue({
      items: [mockVehicle],
      total: 1,
    });

    vehicleApi.deleteVehicle.mockResolvedValue({ message: 'Deleted successfully' });

    renderWithProviders(<AdminVehiclesPage />);

    await waitFor(() => {
      expect(screen.getByText('Chevrolet Tahoe')).toBeInTheDocument();
    });

    const deleteBtn = screen.getByTitle('Delete');
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete "Chevrolet Tahoe"\?/i)).toBeInTheDocument();
    });

    const confirmBtn = screen.getByRole('button', { name: /Delete Vehicle/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(vehicleApi.deleteVehicle).toHaveBeenCalledWith(1);
    });
  });

  it('opens restock modal and submits new stock quantity', async () => {
    const mockVehicle = {
      id: 2,
      make: 'Subaru',
      model: 'Outback',
      category: 'Wagon',
      price: '32000.00',
      quantity: 0,
      year: 2024,
    };

    vehicleApi.getVehicles.mockResolvedValue({
      items: [mockVehicle],
      total: 1,
    });

    vehicleApi.restockVehicle.mockResolvedValue({ message: 'Restocked successfully' });

    renderWithProviders(<AdminVehiclesPage />);

    await waitFor(() => {
      expect(screen.getByText('Subaru Outback')).toBeInTheDocument();
    });

    const restockBtn = screen.getByTitle('Restock');
    fireEvent.click(restockBtn);

    await waitFor(() => {
      expect(screen.getByText(/Restock Subaru Outback/i)).toBeInTheDocument();
    });

    const confirmRestockBtn = screen.getByRole('button', { name: /Confirm Restock/i });
    fireEvent.submit(confirmRestockBtn.closest('form'));

    await waitFor(() => {
      expect(vehicleApi.restockVehicle).toHaveBeenCalledWith(2, 5);
    });
  });
});
