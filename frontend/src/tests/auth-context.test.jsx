import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';

vi.mock('../api/authApi');

const TestConsumer = () => {
  const { user, token, loading, isAuthenticated, isAdmin, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="user-role">{user ? user.role : 'No User'}</div>
      <div data-testid="is-admin">{isAdmin ? 'Admin' : 'Not Admin'}</div>
      <button onClick={() => login({ email: 'test@example.com', password: 'Password@123' })}>Login Button</button>
      <button onClick={logout}>Logout Button</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('provides default unauthenticated state when no token exists', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
    expect(screen.getByTestId('user-role')).toHaveTextContent('No User');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('Not Admin');
  });

  it('restores authenticated session on mount if token is stored in localStorage', async () => {
    localStorage.setItem('token', 'fake-jwt-token');
    authApi.getCurrentUser.mockResolvedValueOnce({
      id: 1,
      full_name: 'Test User',
      email: 'test@example.com',
      role: 'customer',
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    expect(screen.getByTestId('user-role')).toHaveTextContent('customer');
    expect(screen.getByTestId('is-admin')).toHaveTextContent('Not Admin');
  });

  it('clears token and session if session restoration fails', async () => {
    localStorage.setItem('token', 'expired-token');
    authApi.getCurrentUser.mockRejectedValueOnce(new Error('Unauthorized'));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('handles login and updates auth state', async () => {
    authApi.login.mockResolvedValueOnce({
      access_token: 'new-token',
      token_type: 'bearer',
      user: { id: 2, full_name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    fireEvent.click(screen.getByText('Login Button'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    expect(screen.getByTestId('is-admin')).toHaveTextContent('Admin');
    expect(localStorage.getItem('token')).toBe('new-token');
  });

  it('handles logout and clears storage', async () => {
    localStorage.setItem('token', 'valid-token');
    authApi.getCurrentUser.mockResolvedValueOnce({
      id: 1,
      full_name: 'Test User',
      email: 'test@example.com',
      role: 'customer',
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    fireEvent.click(screen.getByText('Logout Button'));

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(localStorage.getItem('token')).toBeNull();
  });
});
