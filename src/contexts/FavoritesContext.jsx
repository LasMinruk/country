import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import * as api from "../services/favoriteService";

// Create and export context
export const FavoritesContext = createContext();
export const useFavorites = () => useContext(FavoritesContext);

// Provider component for managing favorite countries
export const FavoritesProvider = ({ children }) => {
  // Get current user and initialize favorites state
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Load favorites from backend when user logs in
  useEffect(() => {
    const fetchFavorites = async () => {
      if (currentUser?.email) {
        try {
          const data = await api.getFavorites(currentUser.email);
          setFavorites(data.map((item) => item.country));
        } catch (err) {
          console.error(" Failed to load favorites:", err.message);
        }
      }
    };
    fetchFavorites();
  }, [currentUser]);

  // Toggle favorite status with backend sync
  const toggleFavorite = async (country) => {
    if (!currentUser?.email || !country?.cca3) return;

    const isFav = favorites.some((c) => c.cca3 === country.cca3);
    if (isFav) {
      await api.removeFavorite(currentUser.email, country.cca3);
      setFavorites((prev) => prev.filter((c) => c.cca3 !== country.cca3));
    } else {
      await api.addFavorite(currentUser.email, country);
      setFavorites((prev) => [...prev, country]);
    }
  };

  // Check if a country is in favorites
  const isFavorite = (code) =>
    Array.isArray(favorites) && code && favorites.some((c) => c?.cca3 === code);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
