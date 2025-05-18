import React, { useEffect, useState, useRef } from "react";
import CountryCard from "../components/CountryCard";
import { useFavorites } from "../contexts/FavoritesContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaSearch, FaGlobe, FaArrowUp, FaLanguage, FaMoneyBillWave, FaSort } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState("");
  const [language, setLanguage] = useState("");
  const [currency, setCurrency] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");
  const [currencySearch, setCurrencySearch] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sortBy, setSortBy] = useState("");

  const languageDropdownRef = useRef(null);
  const currencyDropdownRef = useRef(null);

  const { favorites } = useFavorites();

  // Get unique languages and currencies from countries
  const uniqueLanguages = [...new Set(
    countries.flatMap(country => 
      Object.values(country.languages || {})
    )
  )].sort();

  const uniqueCurrencies = [...new Set(
    countries.flatMap(country => 
      Object.values(country.currencies || {}).map(curr => `${curr.name} (${curr.symbol})`)
    )
  )].sort();

  // Filter languages and currencies based on search
  const filteredLanguages = uniqueLanguages.filter(lang => 
    lang.toLowerCase().includes(languageSearch.toLowerCase())
  );

  const filteredCurrencies = uniqueCurrencies.filter(curr => 
    curr.toLowerCase().includes(currencySearch.toLowerCase())
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setShowCurrencyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((res) => {
        setCountries(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching countries:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = countries;

    // Filter countries based on search term
    if (searchTerm) {
      result = result.filter((c) =>
        c.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected region
    if (region) {
      result = result.filter((c) => c.region === region);
    }

    // Filter by selected language
    if (language) {
      result = result.filter((c) => 
        Object.values(c.languages || {}).includes(language)
      );
    }

    // Filter by selected currency
    if (currency) {
      result = result.filter((c) => 
        Object.values(c.currencies || {}).some(curr => 
          `${curr.name} (${curr.symbol})` === currency
        )
      );
    }

    // Filter to show only favorite countries if enabled
    if (showFavoritesOnly) {
      result = result.filter((c) =>
        favorites.some((fav) => fav.cca3 === c.cca3)
      );
    }

    // Sort countries based on selected criteria
    if (sortBy) {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case "population-asc":
            return a.population - b.population;
          case "population-desc":
            return b.population - a.population;
          case "area-asc":
            return a.area - b.area;
          case "area-desc":
            return b.area - a.area;
          default:
            return 0;
        }
      });
    }

    setFiltered(result);
  }, [searchTerm, region, language, currency, showFavoritesOnly, countries, favorites, sortBy]);

  // Handle scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to top of page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-[#1877f2]">
            Explore Countries
          </h2>
          <div className="w-full sm:w-auto relative">
            <label htmlFor="sort-select" className="sr-only">Sort countries</label>
            <FaSort className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              id="sort-select"
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none shadow-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="population-desc">Population (High to Low)</option>
              <option value="population-asc">Population (Low to High)</option>
              <option value="area-desc">Area (Large to Small)</option>
              <option value="area-asc">Area (Small to Large)</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
              Search Countries
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="search-input"
                type="text"
                placeholder="Search by country name..."
                className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 hover:bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Region Filter */}
          <div className="relative">
            <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-2">
              Region
            </label>
            <div className="relative">
              <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                id="region-select"
                className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-gray-200 bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none shadow-sm"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">All Regions</option>
                <option value="Africa">Africa</option>
                <option value="Americas">Americas</option>
                <option value="Asia">Asia</option>
                <option value="Europe">Europe</option>
                <option value="Oceania">Oceania</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Language Filter */}
          <div className="relative" ref={languageDropdownRef}>
            <label htmlFor="language-button" className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <div className="relative">
              <FaLanguage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                id="language-button"
                type="button"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-gray-200 bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-left flex items-center justify-between shadow-sm"
              >
                <span className="truncate">{language || "Select Language"}</span>
                <div className="flex items-center gap-2">
                  {language && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLanguage("");
                      }}
                      className="p-1 hover:bg-gray-200 rounded-full transition"
                      title="Clear selection"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {showLanguageDropdown && (
                <div className="absolute z-40 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-auto">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search languages..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={languageSearch}
                      onChange={(e) => setLanguageSearch(e.target.value)}
                    />
                  </div>
                  <div className="py-1">
                    {filteredLanguages.map((lang) => (
                      <button
                        key={lang}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => {
                          setLanguage(lang);
                          setShowLanguageDropdown(false);
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Currency Filter */}
          <div className="relative" ref={currencyDropdownRef}>
            <label htmlFor="currency-button" className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <div className="relative">
              <FaMoneyBillWave className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <button
                id="currency-button"
                type="button"
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-gray-200 bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-left flex items-center justify-between shadow-sm"
              >
                <span className="truncate">{currency || "Select Currency"}</span>
                <div className="flex items-center gap-2">
                  {currency && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrency("");
                      }}
                      className="p-1 hover:bg-gray-200 rounded-full transition"
                      title="Clear selection"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {showCurrencyDropdown && (
                <div className="absolute z-40 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-auto">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search currencies..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      value={currencySearch}
                      onChange={(e) => setCurrencySearch(e.target.value)}
                    />
                  </div>
                  <div className="py-1">
                    {filteredCurrencies.map((curr) => (
                      <button
                        key={curr}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => {
                          setCurrency(curr);
                          setShowCurrencyDropdown(false);
                        }}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-500 col-span-full py-10 text-lg">
          No countries found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-up"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 sm:bottom-8"
            aria-label="Scroll to top"
          >
            <FaArrowUp className="text-2xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
