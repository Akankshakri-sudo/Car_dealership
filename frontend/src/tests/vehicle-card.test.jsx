import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VehicleCard from '../components/VehicleCard';
import { AuthProvider } from '../context/AuthContext';
import { authApi } from '../api/authApi';

vi.mock('../api/authApi');

const sampleVehicle = {
  id: 1,
  make: 'Tesla',
  model: 'Model 3',
  category: 'Electric',
  price: '42990.00',
  quantity: 3,
  year: 2024,
  color: 'Red',
  description: 'Sleek all-electric sedan',
  image_url: 'https://example.com/tesla.jpg',
};

const renderWithAuth = (ui, userRole = 'customer') => {
  if (userRole) {
    localStorage.setItem('token', 'test-token');
    authApi.getCurrentUser.mockResolvedValue({
      id: 1,
      full_name: 'Test User',
      email: 'test@example.com',
      role: userRole,
    });
  }
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe('VehicleCard Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('renders vehicle information correctly', () => {
    renderWithAuth(<VehicleCard vehicle={sampleVehicle} />);

    expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
    expect(screen.getByText('$42,990.00')).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('3 Available')).toBeInTheDocument();
  });

  it('shows Out of Stock badge and disables purchase button when quantity is 0', () => {
    const outOfStockVehicle = { ...sampleVehicle, quantity: 0 };
    renderWithAuth(<VehicleCard vehicle={outOfStockVehicle} />);

    expect(screen.getAllByText('Out of Stock').length).toBeGreaterThan(0);
    const purchaseButton = screen.getByRole('button', { name: /Out of Stock/i });
    expect(purchaseButton).toBeDisabled();
  });

  it('calls onPurchase handler when purchase button is clicked', async () => {
    const handlePurchase = vi.fn().mockResolvedValue({ message: 'Success' });
    renderWithAuth(<VehicleCard vehicle={sampleVehicle} onPurchase={handlePurchase} />);

    const purchaseButton = screen.getByRole('button', { name: /Purchase Vehicle/i });
    expect(purchaseButton).not.toBeDisabled();

    fireEvent.click(purchaseButton);

    await waitFor(() => {
      expect(handlePurchase).toHaveBeenCalledWith(1, 1);
    });
  });

  it('renders admin controls (Restock, Edit, Delete) when user is admin', async () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    const handleRestock = vi.fn();

    renderWithAuth(
      <VehicleCard
        vehicle={sampleVehicle}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestock={handleRestock}
      />,
      'admin'
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Restock/i })).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Restock/i }));
    expect(handleRestock).toHaveBeenCalledWith(sampleVehicle);
  });
});
