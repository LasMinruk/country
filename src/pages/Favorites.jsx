// Import React and required dependencies
import React from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import CountryCard from "../components/CountryCard";
import { Link } from "react-router-dom";

// Page component for displaying user's favorite countries
const Favorites = () => {
  // Get favorites from context
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Favorite Countries</h1>
      {favorites.length === 0 ? (
        // Empty state message
        <div className="text-center">
          <p className="text-xl mb-4">You haven't added any favorites yet.</p>
          <Link to="/" className="text-blue-500 hover:underline">
            Browse countries
          </Link>
        </div>
      ) : (
        // Grid of favorite country cards
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
