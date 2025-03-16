/**
 * Home page component that displays trending movies and search results
 *
 * Features:
 * - Search functionality with debounce
 * - Trending movies display with time window toggle

 */
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
  const [timeWindow, setTimeWindow] = useState("week");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const loadMovies = useCallback(
    async (query = "", page = 1) => {
      try {
        setIsSearching(true);
        const data = query.trim()
          ? await searchMovies(query, page)
          : await getTrendingMovies(timeWindow, page);

        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDB limits to 500 pages max
        setCurrentPage(page);
        setError(data.results.length === 0 ? "No movies found" : null);
      } catch (error) {
        console.error("Error loading movies:", error);
        setError("Failed to load movies");
      } finally {
        setIsSearching(false);
        setLoading(false);
      }
    },
    [timeWindow]
  );

  useEffect(() => {
    loadMovies();
  }, [timeWindow, loadMovies]);

  useEffect(() => {
    if (movies.length === 0) {
      loadMovies();
    }
  }, [movies.length, loadMovies]);

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
        onToggle={() =>
          setTimeWindow((prev) => (prev === "week" ? "day" : "week"))
        }
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        isSearching={isSearching}
      />

      <MovieGrid movies={movies} error={error} loading={loading} />

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => loadMovies(searchQuery, currentPage - 1)}
            disabled={currentPage <= 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-indicator">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => loadMovies(searchQuery, currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
