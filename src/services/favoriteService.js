// Import axios for HTTP requests
import axios from "axios";

// Base API URL for favorites
const API = "http://localhost:5000/api/favorites";

// Get all favorites for a user
export const getFavorites = async (email) => {
  const res = await axios.get(`${API}/${email}`);
  return res.data;
};

// Add a new favorite country
export const addFavorite = async (email, country) => {
  const res = await axios.post(API, { email, country });
  return res.data;
};

// Remove a favorite country
export const removeFavorite = async (email, code) => {
  const res = await axios.delete(`${API}/${email}/${code}`);
  return res.data;
};
