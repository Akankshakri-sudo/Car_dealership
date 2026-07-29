import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { AuthProvider } from '../context/AuthContext';
import { authApi } from '../api/authApi';

vi.mock('../api/authApi');

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </AuthProvider>
  );
};

describe('Frontend Authentication Components', () => {
  it('renders login form elements correctly', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByPlaceholderText(/akanksha@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('renders register form and validates password match', async () => {
    renderWithProviders(<RegisterPage />);
    
    fireEvent.change(screen.getByPlaceholderText(/akanksha kumari/i), { target: { value: 'Akanksha Kumari' } });
    fireEvent.change(screen.getByPlaceholderText(/akanksha@example.com/i), { target: { value: 'akanksha@example.com' } });
    fireEvent.change(screen.getAllByPlaceholderText(/••••••••/i)[0], { target: { value: 'Password@123' } });
    fireEvent.change(screen.getAllByPlaceholderText(/••••••••/i)[1], { target: { value: 'DifferentPassword@123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });
});
