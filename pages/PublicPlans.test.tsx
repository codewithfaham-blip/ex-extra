import React from 'react';
// Fix: Added missing imports for vitest globals
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '../store/AppContext';
import { PublicPlansPage } from './PublicPlans';

describe('PublicPlansPage', () => {
  it('renders the investment plans', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <PublicPlansPage />
        </AppProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Investment Plans')).toBeInTheDocument();
    expect(screen.getByText('Standard Alpha')).toBeInTheDocument();
    expect(screen.getByText('Ethereum Plus')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin Pro')).toBeInTheDocument();
  });
});