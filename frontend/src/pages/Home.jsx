import { useState, useEffect, useCallback } from "react";
import { getTrendingMovies, searchMovies } from "../services/api";
import TrendingToggle from "../components/TrendingToggle";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [timeWindow, setTimeWindow] = useState('week');

  const loadMovies = useCallback(async (query = "") => {
    try {
      setIsSearching(true);
      const results = query.trim()
        ? await searchMovies(query)
        : await getTrendingMovies(timeWindow);
      
      setMovies(results);
      setError(results.length === 0 ? "No movies found" : null);
    } catch (error) {
      console.error(error);
      setError("Failed to load movies");
    } finally {
      setIsSearching(false);
      setLoading(false);
    }
  }, [timeWindow]);

  // Load initial movies
  useEffect(() => {
    loadMovies();
  }, [timeWindow, loadMovies]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadMovies(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadMovies]);

  return (
    <div className="home">
      <TrendingToggle 
        timeWindow={timeWindow}
        onToggle={() => setTimeWindow(prev => prev === 'week' ? 'day' : 'week')}
      />
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        isSearching={isSearching}
      />
      <MovieGrid 
        movies={movies}
        error={error}
        loading={loading}
      />
    </div>
  );
}

export default Home;
