// Country comparison page with interactive charts and country selection
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { FaSearch, FaTimes, FaPlus } from 'react-icons/fa';

// Register Chart.js components for line charts
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Predefined list of popular countries for quick comparison
const popularCountries = ['USA', 'CHN', 'IND', 'GBR', 'FRA', 'JPN', 'DEU', 'BRA', 'AUS', 'CAN'];

const CountryComparison = () => {
  // State management for countries data and UI
  const [countries, setCountries] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAllCountries, setShowAllCountries] = useState(false);

  // Fetch countries data on component mount
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        setLoading(false);
      });
  }, []);

  // Country selection handlers
  const handleAddCountry = (code) => {
    if (!selected.includes(code)) {
      setSelected([...selected, code]);
    }
  };

  const handleRemoveCountry = (code) => {
    setSelected(selected.filter(c => c !== code));
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  // Quick selection of popular countries
  const handleComparePopular = () => {
    const availablePopular = popularCountries.filter(code => 
      countries.some(c => c.cca3 === code)
    );
    setSelected(availablePopular.slice(0, 5)); // First 5 available
  };

  // Filter and prepare data for display
  const selectedCountries = countries.filter(c => selected.includes(c.cca3));
  const labels = selectedCountries.map(c => c.name.common);

  // Filter countries based on search input
  const filteredCountries = countries.filter(c => 
    c.name.common.toLowerCase().includes(search.toLowerCase()) ||
    c.cca3.toLowerCase().includes(search.toLowerCase())
  );

  // Chart data configuration for population comparison
  const populationData = {
    labels,
    datasets: [
      {
        label: 'Population',
        data: selectedCountries.map(c => c.population),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.3,
      },
    ],
  };

  // Chart data configuration for area comparison
  const areaData = {
    labels,
    datasets: [
      {
        label: 'Area (km²)',
        data: selectedCountries.map(c => c.area),
        borderColor: '#059669',
        backgroundColor: 'rgba(5,150,105,0.1)',
        tension: 0.3,
      },
    ],
  };

  // Chart display options and formatting
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US').format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: { 
      y: { 
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('en-US', { 
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value);
          }
        }
      } 
    },
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header section with title and description */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Country Comparison</h1>
        <p className="text-center text-gray-600 mb-4">Compare statistics across different countries</p>
        
        {/* Search bar and action buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleComparePopular}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
            >
              Compare Popular
            </button>
            <button
              onClick={handleClearAll}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition shadow-sm"
            >
              Clear All
            </button>
          </div>
        </div>
        
        {/* Selected countries display */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Selected Countries:</h2>
          {selected.length === 0 ? (
            <div className="text-gray-500 italic">No countries selected. Select countries to compare.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedCountries.map(country => (
                <div key={country.cca3} className="bg-white flex items-center gap-2 px-3 py-1 rounded-full text-sm border border-gray-200 shadow-sm">
                  <img src={country.flags.svg} alt={`${country.name.common} flag`} className="w-4 h-4 rounded-full" />
                  <span>{country.name.common}</span>
                  <button 
                    onClick={() => handleRemoveCountry(country.cca3)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Country selection grid */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Available Countries</h2>
            <button 
              onClick={() => setShowAllCountries(!showAllCountries)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showAllCountries ? 'Show Less' : 'Show All'}
            </button>
          </div>
          
          {/* Country selection grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-2">
            {(showAllCountries ? filteredCountries : filteredCountries.slice(0, 15)).map(country => (
              <button
                key={country.cca3}
                onClick={() => handleAddCountry(country.cca3)}
                disabled={selected.includes(country.cca3)}
                className={`flex items-center gap-2 p-2 rounded border text-left text-sm ${
                  selected.includes(country.cca3) 
                    ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-not-allowed' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <img src={country.flags.svg} alt={`${country.name.common} flag`} className="w-5 h-5 rounded-sm" />
                <span className="truncate">{country.name.common}</span>
                {!selected.includes(country.cca3) && <FaPlus className="ml-auto text-gray-400" />}
              </button>
            ))}
          </div>
          
          {/* Search results summary */}
          {filteredCountries.length > 15 && !showAllCountries && (
            <div className="text-center text-sm text-gray-500">
              ... and {filteredCountries.length - 15} more countries
            </div>
          )}
          
          {filteredCountries.length === 0 && (
            <div className="text-center text-gray-500 py-2">
              No countries found matching "{search}"
            </div>
          )}
        </div>
      </div>
      
      {/* Comparison charts section */}
      {selectedCountries.length > 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Population comparison chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Population</h2>
            <div className="h-80 relative">
              <Line data={populationData} options={chartOptions} />
            </div>
          </div>
          
          {/* Area comparison chart */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Area (km²)</h2>
            <div className="h-80 relative">
              <Line data={areaData} options={chartOptions} />
            </div>
          </div>
        </div>
      ) : (
        // Empty state or single country selection message
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-gray-500 text-lg mb-4">
            {selectedCountries.length === 0 
              ? "Select at least two countries to compare" 
              : "Select one more country to compare"}
          </div>
          {selectedCountries.length === 1 && (
            <div className="flex justify-center">
              <div className="bg-blue-50 flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200">
                <img 
                  src={selectedCountries[0].flags.svg} 
                  alt={`${selectedCountries[0].name.common} flag`} 
                  className="w-6 h-6 rounded-full" 
                />
                <span className="font-medium">{selectedCountries[0].name.common}</span>
                <span className="text-gray-500">is selected</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountryComparison; 