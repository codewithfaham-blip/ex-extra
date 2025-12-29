import React from 'react';
// Fix: Added missing imports for vitest globals
import { describe, it, expect } from 'vitest';
// Fix: Destructured getByText from render as screen is not exported in this environment
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '../store/AppContext';
import { PublicPlansPage } from './PublicPlans';

describe('PublicPlansPage', () => {
  it('renders the investment plans', () => {
    // Fix: Destructured getByText to avoid "screen is not exported" error from @testing-library/react
    const { getByText } = render(
      <MemoryRouter>
        <AppProvider>
          <PublicPlansPage />
        </AppProvider>
      </MemoryRouter>
    );

    expect(getByText('Investment Plans')).toBeInTheDocument();
    expect(getByText('Standard Alpha')).toBeInTheDocument();
    expect(getByText('Ethereum Plus')).toBeInTheDocument();
    expect(getByText('Bitcoin Pro')).toBeInTheDocument();
  });
});