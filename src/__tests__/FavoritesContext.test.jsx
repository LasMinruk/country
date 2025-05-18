import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoritesProvider, useFavorites } from '../contexts/FavoritesContext';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import * as favoriteService from '../services/favoriteService';

// Mock AuthContext
const mockAuthContext = {
  currentUser: { email: 'test@example.com' }
};

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthContext: {
    Provider: ({ children, value }) => children
  }
}));

jest.mock('../services/favoriteService', () => ({
  getFavorites: jest.fn().mockResolvedValue([]),
  addFavorite: jest.fn().mockResolvedValue({}),
  removeFavorite: jest.fn().mockResolvedValue({})
}));

// UNIT TEST SETUP: Mock localStorage implementation
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key],
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

// UNIT TEST SETUP: Configure mock localStorage before tests
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
});

describe('FavoritesContext', () => {
  const sampleCountries = [
    { cca3: 'FRA', name: { common: 'France' } },
    { cca3: 'BRA', name: { common: 'Brazil' } },
  ];

  // UNIT TEST SETUP: Reset localStorage and mocks before each test
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  // UNIT TEST: Testing component that uses the favorites context
  const TestComponent = () => {
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    return (
      <div>
        <div data-testid="favorites-count">{favorites.length}</div>
        <button onClick={() => toggleFavorite(sampleCountries[0])}>Toggle France</button>
        <button onClick={() => toggleFavorite(sampleCountries[1])}>Toggle Brazil</button>
        <div data-testid="is-france-favorite">{isFavorite('FRA').toString()}</div>
        <div data-testid="is-brazil-favorite">{isFavorite('BRA').toString()}</div>
      </div>
    );
  };

  // UNIT TEST SETUP: Helper function to render test component with providers
  const renderWithProviders = () => {
    return render(
      <BrowserRouter>
        <FavoritesProvider>
          <TestComponent />
        </FavoritesProvider>
      </BrowserRouter>
    );
  };

  // UNIT TEST: Testing initial state of favorites
  test('initializes with empty favorites', async () => {
    renderWithProviders();
    await waitFor(() => {
      expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
      expect(screen.getByTestId('is-france-favorite')).toHaveTextContent('false');
      expect(screen.getByTestId('is-brazil-favorite')).toHaveTextContent('false');
    });
  });

  // UNIT TEST: Testing adding and removing favorites
  test('adds and removes favorites correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    
    await act(async () => {
      await user.click(screen.getByText('Toggle France'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
      expect(screen.getByTestId('is-france-favorite')).toHaveTextContent('true');
    });

    await act(async () => {
      await user.click(screen.getByText('Toggle France'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
      expect(screen.getByTestId('is-france-favorite')).toHaveTextContent('false');
    });
  });

  // UNIT TEST: Testing localStorage persistence
  test('persists favorites in localStorage', async () => {
    const user = userEvent.setup();
    renderWithProviders();
    
    await act(async () => {
      await user.click(screen.getByText('Toggle France'));
    });

    await waitFor(() => {
      expect(favoriteService.addFavorite).toHaveBeenCalledWith('test@example.com', sampleCountries[0]);
      expect(screen.getByTestId('is-france-favorite')).toHaveTextContent('true');
    });
  });
});
