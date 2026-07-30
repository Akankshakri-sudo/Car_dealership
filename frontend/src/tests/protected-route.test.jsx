import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import { authApi } from '../api/authApi';

vi.mock('../api/authApi');

const TestApp = () => (
  <Routes>
    <Route path="/login" element={<div>Login Page Screen</div>} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<div>Protected Dashboard Screen</div>} />
    </Route>
  </Routes>
);

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('redirects unauthenticated user to /login', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <TestApp />
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page Screen')).toBeInTheDocument();
    });
  });

  it('allows access to protected route when authenticated', async () => {
    localStorage.setItem('token', 'valid-token');
    authApi.getCurrentUser.mockResolvedValueOnce({
      id: 1,
      full_name: 'Customer User',
      email: 'customer@example.com',
      role: 'customer',
    });

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <TestApp />
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Dashboard Screen')).toBeInTheDocument();
    });
  });
});
