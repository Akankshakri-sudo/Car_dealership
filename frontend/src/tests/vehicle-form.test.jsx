import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddVehiclePage from '../pages/AddVehiclePage';
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

describe('AddVehiclePage Form Validation & Submission', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('renders form inputs for adding a vehicle', () => {
    renderWithProviders(<AddVehiclePage />);

    expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Toyota/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Camry/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Vehicle/i })).toBeInTheDocument();
  });

  it('shows error validation when make or model is empty', async () => {
    renderWithProviders(<AddVehiclePage />);

    const submitBtn = screen.getByRole('button', { name: /Save Vehicle/i });
    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/Make and Model are required\./i)).toBeInTheDocument();
    });
  });

  it('shows error validation when price is zero', async () => {
    renderWithProviders(<AddVehiclePage />);

    fireEvent.change(screen.getByPlaceholderText(/e.g. Toyota/i), { target: { name: 'make', value: 'Nissan' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. Camry/i), { target: { name: 'model', value: 'Altima' } });
    fireEvent.change(screen.getByPlaceholderText(/28500\.00/i), { target: { name: 'price', value: '0' } });

    const submitBtn = screen.getByRole('button', { name: /Save Vehicle/i });
    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/Price must be greater than zero\./i)).toBeInTheDocument();
    });
  });

  it('submits new vehicle data when valid inputs are provided', async () => {
    vehicleApi.createVehicle.mockResolvedValueOnce({
      id: 10,
      make: 'Nissan',
      model: 'Altima',
      category: 'Sedan',
      price: 25000,
      quantity: 5,
    });

    renderWithProviders(<AddVehiclePage />);

    fireEvent.change(screen.getByPlaceholderText(/e.g. Toyota/i), { target: { name: 'make', value: 'Nissan' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. Camry/i), { target: { name: 'model', value: 'Altima' } });
    fireEvent.change(screen.getByPlaceholderText(/28500\.00/i), { target: { name: 'price', value: '25000' } });

    const submitBtn = screen.getByRole('button', { name: /Save Vehicle/i });
    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      expect(vehicleApi.createVehicle).toHaveBeenCalledWith(
        expect.objectContaining({
          make: 'Nissan',
          model: 'Altima',
          price: 25000,
          quantity: 5,
        })
      );
    });
  });
});
