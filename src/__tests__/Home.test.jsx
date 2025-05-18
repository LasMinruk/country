import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import Home from '../pages/Home';
import axios from 'axios';
import '@testing-library/jest-dom';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// Mock CountryCard component
jest.mock('../components/CountryCard', () => {
  return function MockCountryCard({ country }) {
    return (
      <div data-testid="country-card">
        <h3>{country.name.common}</h3>
        <p>Population: {country.population}</p>
        <p>Region: {country.region}</p>
        <p>Capital: {country.capital?.[0]}</p>
      </div>
    );
  };
});

// INTEGRATION TEST SETUP: Mock axios for API calls
jest.mock('axios');

// INTEGRATION TEST SETUP: Mock AuthContext
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { email: 'test@example.com' }
  })
}));

// Mock favorites state and functions
const mockFavoritesContext = {
  favorites: [],
  toggleFavorite: jest.fn(),
  isFavorite: jest.fn().mockImplementation(() => false)
};

// INTEGRATION TEST SETUP: Mock country data for testing
const mockCountries = [
  {
    name: { common: 'France' },
    population: 67000000,
    region: 'Europe',
    capital: ['Paris'],
    flags: { svg: 'https://flagcdn.com/fr.svg' },
    languages: { fra: 'French' },
    cca3: 'FRA'
  },
  {
    name: { common: 'Brazil' },
    population: 210000000,
    region: 'Americas',
    capital: ['Brasília'],
    flags: { svg: 'https://flagcdn.com/br.svg' },
    languages: { por: 'Portuguese' },
    cca3: 'BRA'
  },
  {
    name: { common: 'Japan' },
    population: 125000000,
    region: 'Asia',
    capital: ['Tokyo'],
    flags: { svg: 'https://flagcdn.com/jp.svg' },
    languages: { jpn: 'Japanese' },
    cca3: 'JPN'
  }
];

describe('Home Page', () => {
  // INTEGRATION TEST SETUP: Reset mocks and set default API response
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockCountries });
  });

  // INTEGRATION TEST SETUP: Helper function to render Home with providers
  const renderHome = () => {
    return render(
      <BrowserRouter>
        <FavoritesContext.Provider value={mockFavoritesContext}>
          <Home />
        </FavoritesContext.Provider>
      </BrowserRouter>
    );
  };

  // INTEGRATION TEST: Testing initial render and API integration
  test('renders all countries initially', async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getByText(/France/i)).toBeInTheDocument();
      expect(screen.getByText(/Brazil/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  // INTEGRATION TEST: Testing region filtering functionality
  test('filters countries by region', async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getByText(/France/i)).toBeInTheDocument();
    });
    
    const regionSelect = screen.getByRole('combobox', { name: /region/i });
    await act(async () => {
      fireEvent.change(regionSelect, { target: { value: 'Europe' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/France/i)).toBeInTheDocument();
      expect(screen.queryByText(/Brazil/i)).not.toBeInTheDocument();
    });
  });

  // INTEGRATION TEST: Testing search functionality
  test('searches countries by name', async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getByText(/France/i)).toBeInTheDocument();
    });
    
    const searchInput = screen.getByRole('textbox', { name: /search countries/i });
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'Brazil' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Brazil/i)).toBeInTheDocument();
      expect(screen.queryByText(/France/i)).not.toBeInTheDocument();
    });
  });

  // INTEGRATION TEST: Testing error handling
  test('handles API error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API Error'));
    renderHome();
    await waitFor(() => {
      expect(screen.getByText(/No countries found/i)).toBeInTheDocument();
    });
  });

  // INTEGRATION TEST: Testing combined features
  test('combines search and region filters', async () => {
    renderHome();
    await waitFor(() => {
      expect(screen.getByText(/France/i)).toBeInTheDocument();
    });
    
    const searchInput = screen.getByRole('textbox', { name: /search countries/i });
    const regionSelect = screen.getByRole('combobox', { name: /region/i });
    
    await act(async () => {
      fireEvent.change(regionSelect, { target: { value: 'Asia' } });
      fireEvent.change(searchInput, { target: { value: 'Japan' } });
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Japan/i)).toBeInTheDocument();
      expect(screen.queryByText(/France/i)).not.toBeInTheDocument();
    });
  });
});
