import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import InfoCard from "../components/InfoCard";

// Page component for displaying detailed country information
const CountryDetail = () => {
  // Get country code from URL and initialize state
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [error, setError] = useState(false);

  // Fetch country details and border countries
  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`https://restcountries.com/v3.1/alpha/${code}`)
      .then((res) => res.json())
      .then((data) => {
        const found = data[0];
        if (found) {
          setCountry(found);
          setError(false);

          // Fetch border countries if exist
          if (found.borders?.length) {
            fetch(
              `https://restcountries.com/v3.1/alpha?codes=${found.borders.join(",")}`
            )
              .then((res) => res.json())
              .then(setBorderCountries);
          }
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching country detail:", err);
        setError(true);
      });
  }, [code]);

  // Error state display
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-red-600 p-6">
        <h1 className="text-3xl font-bold">Country Not Found</h1>
        <p className="text-gray-600 mt-2">
          Something went wrong.{" "}
          <Link to="/" className="text-blue-600 underline">
            Go back home
          </Link>
        </p>
      </div>
    );
  }

  // Loading state display
  if (!country) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500 text-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mr-4"></div>
        Loading country details...
      </div>
    );
  }

  // Destructure country data
  const {
    name,
    flags,
    capital,
    region,
    subregion,
    population,
    area,
    languages,
    timezones,
    currencies,
    maps,
  } = country;

  // Format language and currency lists
  const languageList = languages ? Object.values(languages).join(", ") : "N/A";
  const currencyList = currencies
    ? Object.values(currencies)
        .map((cur) => `${cur.name} (${cur.symbol})`)
        .join(", ")
    : "N/A";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 px-6 py-10 sm:px-10"
    >
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="p-6">
          <Link
            to="/"
            className="flex items-center text-blue-600 font-medium mb-4 hover:underline"
          >
            <FiArrowLeft className="mr-2" /> Back to Home
          </Link>

          {/* Flag */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl shadow-md w-full max-w-xl border border-blue-100">
              <div className="overflow-hidden rounded-md">
                <img
                  src={flags?.svg || flags?.png}
                  alt={`${name.common} flag`}
                  className="w-full h-[240px] object-contain hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
              <p className="text-center text-gray-500 text-sm mt-2 italic">
                Official flag of {name.common}
              </p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-800 mb-1">
            {name.common}
          </h2>
          <p className="text-gray-500 mb-6 italic">{name.official}</p>

          {/* Country information cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <InfoCard label="Capital" value={capital?.[0] || "N/A"} />
            <InfoCard label="Region" value={region} />
            <InfoCard label="Subregion" value={subregion || "N/A"} />
            <InfoCard label="Population" value={population.toLocaleString()} />
            <InfoCard label="Area" value={`${area.toLocaleString()} km²`} />
            <InfoCard label="Languages" value={languageList} />
            <InfoCard label="Timezones" value={timezones?.join(", ")} />
            <InfoCard label="Currencies" value={currencyList} />
          </div>

          {/* Border Countries */}
          {borderCountries.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-2">Border Countries:</h3>
              <div className="flex flex-wrap gap-2">
                {borderCountries.map((b) => (
                  <Link
                    key={b.cca3}
                    to={`/country/${b.cca3}`}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition"
                  >
                    {b.name.common}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Google Maps link */}
          <div className="mt-10 text-center">
            <a
              href={maps?.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
            >
              🌐 View on Google Maps
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CountryDetail;
