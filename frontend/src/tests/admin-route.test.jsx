import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminRoute from '../components/AdminRoute';
import { AuthProvider } from '../context/AuthContext';
import { authApi } from '../api/authApi';

vi.mock('../api/authApi');

const TestApp = () => (
  <Routes>
    <Route path="/login" element={<div>Login Page Screen</div>} />
    <Route path="/dashboard" element={<div>Customer Dashboard Screen</div>} />
    <Route element={<AdminRoute />}>
      <Route path="/admin/vehicles" element={<div>Admin Vehicles Screen</div>} />
    </Route>
  </Routes>
);

describe('AdminRoute Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('redirects unauthenticated user to /login', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/vehicles']}>
          <TestApp />
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page Screen')).toBeInTheDocument();
    });
  });

  it('redirects non-admin customer user to /dashboard', async () => {
    localStorage.setItem('token', 'valid-token');
    authApi.getCurrentUser.mockResolvedValueOnce({
      id: 1,
      full_name: 'Regular Customer',
      email: 'customer@example.com',
      role: 'customer',
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/vehicles']}>
          <TestApp />
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Customer Dashboard Screen')).toBeInTheDocument();
    });
  });

  it('allows access to admin route when authenticated as admin', async () => {
    localStorage.setItem('token', 'admin-token');
    authApi.getCurrentUser.mockResolvedValueOnce({
      id: 2,
      full_name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/vehicles']}>
          <TestApp />
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Admin Vehicles Screen')).toBeInTheDocument();
    });
  });
});
