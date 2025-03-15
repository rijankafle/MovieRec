/**
 * Movie Context Provider
 * 
 * Manages global state for favorites and recommendations view
 */
import { createContext, useContext, useState, useCallback } from 'react';

// Create context
const MovieContext = createContext();

// Custom hook for using the context
export function useMovieContext() {
  return useContext(MovieContext);
}

export function MovieProvider({ children }) {
  // State for favorites
  const [favorites, setFavorites] = useState([]);
  
  // State for recommendations mode
  const [recommendationsMode, setRecommendationsMode] = useState({
    active: false,
    title: '',
  });

  // Add movie to favorites
  const addToFavorites = useCallback((movie) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.some(m => m.id === movie.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, movie];
    });
  }, []);

  // Remove movie from favorites
  const removeFromFavorites = useCallback((movieId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(movie => movie.id !== movieId)
    );
  }, []);

  // Set recommendations mode
  const setRecommendations = useCallback((active, title = '') => {
    setRecommendationsMode({ active, title });
  }, []);

  // Clear recommendations mode
  const clearRecommendations = useCallback(() => {
    setRecommendationsMode({ active: false, title: '' });
  }, []);

  // Value provided by context
  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    recommendationsMode,
    setRecommendations,
    clearRecommendations
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}
