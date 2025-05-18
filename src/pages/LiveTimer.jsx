import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaGlobe, FaClock, FaLinkedin, FaCheckCircle } from "react-icons/fa";
import Clock from "react-clock";
import 'react-clock/dist/Clock.css';

// Simple mapping for demo; for production, use a more complete mapping or a timezone API
const countryToTimezone = {
  "United States": "America/New_York",
  "India": "Asia/Kolkata",
  "United Kingdom": "Europe/London",
  "Japan": "Asia/Tokyo",
  "Australia": "Australia/Sydney",
  "Germany": "Europe/Berlin",
  "France": "Europe/Paris",
  "Brazil": "America/Sao_Paulo",
  "Canada": "America/Toronto",
  "China": "Asia/Shanghai",
  // ... add more as needed
};

// Helper to get time from UTC offset string
function getTimeWithOffset(offsetString) {
  // offsetString example: "UTC+05:30" or "UTC-04:00"
  const match = offsetString.match(/UTC([+-])(\d{2}):(\d{2})/);
  if (!match) return null;
  const sign = match[1] === "+" ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);
  const now = new Date();
  // Get UTC time in ms
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  // Calculate offset in ms
  const offsetMs = sign * (hours * 60 + minutes) * 60000;
  // Create new date with offset
  const local = new Date(utc + offsetMs);
  return local.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

// About section for the page
const AboutUs = () => (
  <div className="mt-16 max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-xl p-8 flex flex-col sm:flex-row items-center gap-8 border border-blue-100">
    <div className="flex flex-col items-center sm:items-start">
      <div className="relative mb-4">
        {/* Image should be located in the public directory */}
        <img
          src="/your-photo.png"
          alt="Lasiru Minruk"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-lg bg-gradient-to-br from-blue-100 to-blue-200"
        />
        <span className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow text-blue-500">
          <FaGlobe size={22} />
        </span>
      </div>
    </div>
    <div className="flex-1">
      <h2 className="text-3xl font-extrabold text-[#1877f2] mb-1">Lasiru Minruk</h2>
      <p className="text-gray-600 mb-3 text-base font-medium">Creator & Developer of Country Explorer</p>
      <ul className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
        {[
          "Explore all countries with detailed info",
          "Favorite countries (with login/signup)",
          "Beautiful login/signup popup with memoji/profile image",
          "Country comparison with interactive line charts",
          "Live timer and world clock",
          "Mobile-friendly navigation and UI",
          
          "Modern, responsive design",
        ].map((feature) => (
          <li key={feature} className="flex items-center text-gray-700 text-sm font-medium">
            <FaCheckCircle className="text-[#1877f2] mr-2" /> {feature}
          </li>
        ))}
      </ul>
      <a
        href="https://www.linkedin.com/in/lasiruminruk"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1877f2] text-white font-semibold shadow hover:bg-[#1456b8] transition-colors text-base"
      >
        <FaLinkedin size={20} /> Connect on LinkedIn
      </a>
    </div>
  </div>
);

const LiveTimer = () => {
  // State for search input
  const [search, setSearch] = useState("");
  // State for selected country
  const [country, setCountry] = useState("");
  // State for IANA timezone string
  const [timezone, setTimezone] = useState("");
  // State for current time string
  const [time, setTime] = useState("");
  // State for error messages
  const [error, setError] = useState("");
  // State for country name suggestions
  const [suggestions, setSuggestions] = useState([]);
  // State to show/hide suggestions dropdown
  const [showSuggestions, setShowSuggestions] = useState(false);
  // State for loading suggestions
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  // State for UTC offset string
  const [offsetString, setOffsetString] = useState("");
  // State for country flag URL
  const [flagUrl, setFlagUrl] = useState("");
  // State for analog clock (local time or selected country time)
  const [clockTime, setClockTime] = useState(new Date());

  // Update the analog clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (timezone) {
        // Use IANA timezone for selected country
        const now = new Date();
        const options = { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        // Get time string in target timezone
        const timeString = now.toLocaleTimeString('en-US', options);
        // Parse time string to get hours, minutes, seconds
        const [h, m, s] = timeString.split(':').map(Number);
        // Create a new Date object with today's date and the target time
        const newDate = new Date(now);
        newDate.setHours(h, m, s, 0);
        setClockTime(newDate);
      } else if (offsetString) {
        // Use UTC offset for selected country
        const match = offsetString.match(/UTC([+-])(\d{2}):(\d{2})/);
        if (match) {
          const sign = match[1] === '+' ? 1 : -1;
          const hours = parseInt(match[2], 10);
          const minutes = parseInt(match[3], 10);
          const now = new Date();
          const utc = now.getTime() + now.getTimezoneOffset() * 60000;
          const offsetMs = sign * (hours * 60 + minutes) * 60000;
          const local = new Date(utc + offsetMs);
          setClockTime(local);
        } else {
          setClockTime(new Date());
        }
      } else {
        // Default: show local time
        setClockTime(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timezone, offsetString]);

  // Fetch country suggestions as user types (debounced)
  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    const handler = setTimeout(async () => {
      try {
        const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(search.trim())}`);
        setSuggestions(res.data.map(c => c.name.common));
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Handle click on a suggestion
  const handleSuggestionClick = (name) => {
    setSearch(name);
    setShowSuggestions(false);
    handleSearchCountry(name);
  };

  // Handle form submit for country search
  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    handleSearchCountry(search.trim());
  };

  // Fetch timezone and flag for a country
  const handleSearchCountry = async (countryName) => {
    setError("");
    setTime("");
    setTimezone("");
    setCountry("");
    setOffsetString("");
    setFlagUrl("");
    const tz = countryToTimezone[countryName];
    if (tz) {
      setCountry(countryName);
      setTimezone(tz);
      setOffsetString("");
      setFlagUrl("");
      return;
    }
    try {
      const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
      const countryData = res.data[0];
      if (countryData && countryData.timezones && countryData.timezones.length > 0) {
        setCountry(countryData.name.common);
        setTimezone("");
        setOffsetString(countryData.timezones[0]);
        setError("");
        setFlagUrl(countryData.flags?.svg || countryData.flags?.png || "");
      } else {
        setError("Timezone not found for this country.");
      }
    } catch (err) {
      setError("Country not found.");
    }
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12">
      {/* Show analog clock and date always, update for selected country */}
      <div className="flex flex-col items-center mb-8">
        <Clock value={clockTime} size={180} renderNumbers={true} className="mb-3" />
        <div className="text-lg font-semibold text-gray-700 mt-2">
          {clockTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="text-2xl font-mono text-blue-700 mt-1">
          {clockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
        </div>
      </div>
      {/* Main card with search and timer */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="relative z-20 w-full max-w-lg mx-auto"
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.01, boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)" }}
          className="rounded-2xl shadow-2xl bg-white border border-blue-100 px-8 py-10 sm:px-12 sm:py-12 flex flex-col items-center"
        >
          {/* Header and description */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-2">
              <FaClock className="text-[#1877f2] text-3xl drop-shadow" />
              <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#1877f2] tracking-tight">
                Live Country Timer
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base text-center max-w-xs">Check the current time in any country, live and accurate.</p>
          </div>
          {/* Search form */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8 w-full max-w-md relative">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Enter country name..."
                className="flex-1 w-full px-5 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-[#1877f2] outline-none shadow bg-white text-lg font-medium placeholder-gray-400"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => search && setShowSuggestions(true)}
                autoComplete="off"
              />
              {/* Suggestions dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 bg-white border border-blue-100 rounded-xl shadow-lg mt-2 z-10 max-h-56 overflow-auto"
                  >
                    {suggestions.map((s, i) => (
                      <motion.li
                        key={s}
                        className="px-5 py-2 hover:bg-blue-50 cursor-pointer text-base text-gray-700"
                        onClick={() => handleSuggestionClick(s)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        {s}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
              {loadingSuggestions && (
                <div className="absolute right-3 top-3 text-xs text-gray-400">Loading...</div>
              )}
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.07, backgroundColor: "#165ec9" }}
              whileTap={{ scale: 0.97 }}
              className="px-7 py-3 rounded-xl bg-[#1877f2] text-white font-semibold shadow text-lg transition-all focus:ring-2 focus:ring-blue-300 focus:outline-none hover:bg-[#165ec9]"
            >
              Show Time
            </motion.button>
          </form>
          {/* Display time and flag for selected country */}
          <AnimatePresence>
            {country && (
              <motion.div
                key={country}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="text-center mt-6"
              >
                {flagUrl && (
                  <img
                    src={flagUrl}
                    alt={`${country} flag`}
                    className="mx-auto mb-4 w-20 h-12 object-contain rounded-lg shadow border-2 border-blue-100"
                  />
                )}
                <h2 className="text-xl font-semibold mb-3 text-gray-800">
                  {country}
                </h2>
                <motion.div
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl font-mono bg-white rounded-2xl inline-block px-10 py-6 shadow border-2 border-blue-200 text-gray-800 tracking-widest mb-2 ring-2 ring-blue-50"
                  style={{ boxShadow: "0 0 24px 0 rgba(24,119,242,0.08)" }}
                >
                  {time}
                </motion.div>
                <div className="mt-2 text-sm text-blue-500 font-medium">
                  {timezone ? `Timezone: ${timezone}` : offsetString ? `Timezone: ${offsetString}` : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Error message */}
          {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-500 mt-4 font-semibold animate-pulse">{error}</motion.div>}
        </motion.div>
      </motion.div>
      {/* About section at the bottom */}
      <AboutUs />
    </div>
  );
};

export default LiveTimer; 