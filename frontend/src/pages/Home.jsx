import MovieCard from "../components/MovieCard";
import { useState, useEffect, useCallback } from "react";
import "../css/Home.css";
import { getPopularMovies, searchMovies } from "../services/api";

function Home() { 
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Load initial popular movies
  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to load popular movies");
      } finally {
        setLoading(false);
      }
    };
    loadPopularMovies();
  }, []);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Perform search when debounced query changes
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      // If search is cleared, load popular movies
      try {
        setIsSearching(true);
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to load popular movies");
      } finally {
        setIsSearching(false);
      }
      return;
    }

    try {
      setIsSearching(true);
      const searchResults = await searchMovies(query);
      setMovies(searchResults);
      setError(null);
      
      if (searchResults.length === 0) {
        setError("No movies found matching your search");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to search movies");
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Effect for performing search
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  return (
    <div className="home">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {isSearching && <div className="search-spinner">🔄</div>}
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
