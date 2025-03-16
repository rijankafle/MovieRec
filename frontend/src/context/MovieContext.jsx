/**
 * Movie Context Provider
 *
 * Provides global state for:
 * - Favorite movies
 * - Recommendation mode status
 */
import { createContext, useContext, useState, useCallback } from "react";

// Create context
const MovieContext = createContext();

// Custom hook for using the context
export function useMovieContext() {
  return useContext(MovieContext);
}

export function MovieProvider({ children }) {
  // Favorites state
  const [favorites, setFavorites] = useState([]);

  // Recommendations mode state
  const [recommendationsMode, setRecommendationsMode] = useState({
    active: false,
    title: "",
  });

  // Add a movie to favorites (if not already added)
  const addToFavorites = useCallback((movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id) ? prev : [...prev, movie]
    );
  }, []);

  // Remove movie from favorites by ID
  const removeFromFavorites = useCallback((movieId) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
  }, []);

  // Enable recommendations mode with optional title
  const setRecommendations = useCallback((active, title = "") => {
    setRecommendationsMode({ active, title });
  }, []);

  // Disable recommendations mode
  const clearRecommendations = useCallback(() => {
    setRecommendationsMode({ active: false, title: "" });
  }, []);

  return (
    <MovieContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        recommendationsMode,
        setRecommendations,
        clearRecommendations,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}
