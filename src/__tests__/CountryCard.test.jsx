import React, { useState } from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CountryCard from '../components/CountryCard';
import { FavoritesContext } from '../contexts/FavoritesContext';
import '@testing-library/jest-dom';

// Mock react-tooltip
jest.mock('react-tooltip', () => ({
  Tooltip: () => <div data-testid="mock-tooltip" />,
}));

// Mock LoginModalContext
jest.mock('../contexts/LoginModalContext', () => ({
  useLoginModal: () => ({
    openLoginModal: jest.fn()
  })
}));

// Mock AuthContext
const mockAuthContext = {
  currentUser: { email: 'test@example.com' }
};

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthContext: {
    Provider: ({ children }) => children
  }
}));

describe('CountryCard Component', () => {
  const mockCountry = {
    cca3: 'FRA',
    name: { common: 'France' },
    population: 67000000,
    region: 'Europe',
    capital: ['Paris'],
    flags: { png: 'https://flagcdn.com/fr.png' }
  };

  // Helper function to render CountryCard with required providers
  const renderCountryCard = (country = mockCountry) => {
    const TestComponent = () => {
      const [isFavorite, setIsFavorite] = useState(false);
      const mockFavoritesContext = {
        favorites: [],
        toggleFavorite: jest.fn().mockImplementation(() => {
          setIsFavorite(prev => !prev);
        }),
        isFavorite: jest.fn().mockImplementation(() => isFavorite)
      };

      return (
        <BrowserRouter>
          <FavoritesContext.Provider value={mockFavoritesContext}>
            <CountryCard country={country} />
          </FavoritesContext.Provider>
        </BrowserRouter>
      );
    };

    return render(<TestComponent />);
  };

  test('renders country card with correct information', () => {
    renderCountryCard();

    expect(screen.getByText(/France/i)).toBeInTheDocument();
    expect(screen.getByText(/67,000,000/i)).toBeInTheDocument();
    expect(screen.getByText(/Europe/i)).toBeInTheDocument();
    expect(screen.getByText(/Paris/i)).toBeInTheDocument();
    expect(screen.getByAltText('France Flag')).toBeInTheDocument();
  });

  test('toggles favorite status when favorite button is clicked', async () => {
    renderCountryCard();

    // Initially, the outline heart icon should be present
    expect(screen.getByTestId('favorite-icon-outline')).toBeInTheDocument();
    expect(screen.queryByTestId('favorite-icon-filled')).not.toBeInTheDocument();

    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toHaveAttribute('data-tooltip-content', 'Add to favorites');

    // First click - Add to favorites
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(screen.getByTestId('favorite-icon-filled')).toBeInTheDocument();
      expect(screen.queryByTestId('favorite-icon-outline')).not.toBeInTheDocument();
      expect(favoriteButton).toHaveAttribute('data-tooltip-content', 'Remove from favorites');
    });

    // Second click - Remove from favorites
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(screen.getByTestId('favorite-icon-outline')).toBeInTheDocument();
      expect(screen.queryByTestId('favorite-icon-filled')).not.toBeInTheDocument();
      expect(favoriteButton).toHaveAttribute('data-tooltip-content', 'Add to favorites');
    });
  });

  test('navigates to country details when card is clicked', () => {
    renderCountryCard();

    const card = screen.getByRole('link');
    expect(card).toHaveAttribute('href', '/country/FRA');
  });
});
