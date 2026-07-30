import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchFilters from '../components/SearchFilters';

describe('SearchFilters Component', () => {
  it('renders filter form inputs and buttons', () => {
    render(<SearchFilters onFilter={vi.fn()} onReset={vi.fn()} />);

    expect(screen.getByPlaceholderText(/e.g. Toyota/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Camry/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Min Price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Max Price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Apply Search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset Filters/i })).toBeInTheDocument();
  });

  it('calls onFilter callback with parsed inputs on submit', () => {
    const handleFilter = vi.fn();
    render(<SearchFilters onFilter={handleFilter} onReset={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/e.g. Toyota/i), { target: { value: 'BMW' } });
    fireEvent.change(screen.getByPlaceholderText(/e.g. Camry/i), { target: { value: 'M3' } });
    fireEvent.change(screen.getByPlaceholderText(/Min Price/i), { target: { value: '30000' } });
    fireEvent.change(screen.getByPlaceholderText(/Max Price/i), { target: { value: '80000' } });

    fireEvent.click(screen.getByRole('button', { name: /Apply Search/i }));

    expect(handleFilter).toHaveBeenCalledWith({
      make: 'BMW',
      model: 'M3',
      category: '',
      min_price: 30000,
      max_price: 80000,
    });
  });

  it('resets all fields and invokes onReset when reset button clicked', () => {
    const handleReset = vi.fn();
    render(<SearchFilters onFilter={vi.fn()} onReset={handleReset} />);

    const makeInput = screen.getByPlaceholderText(/e.g. Toyota/i);
    fireEvent.change(makeInput, { target: { value: 'Audi' } });
    expect(makeInput).toHaveValue('Audi');

    fireEvent.click(screen.getByRole('button', { name: /Reset Filters/i }));

    expect(makeInput).toHaveValue('');
    expect(handleReset).toHaveBeenCalledTimes(1);
  });
});
