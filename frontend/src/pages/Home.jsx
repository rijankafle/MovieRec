/**
 * Home page component that displays trending movies and search results
 *
 * Features:
 * - Search functionality with debounce
 * - Trending movies display with time window toggle
 * - Movie recommendations based on selection
 */
import { useState, useEffect, useCallback } from "react";
import { getTrendingMovies, searchMovies } from "../services/api";
import { useMovieContext } from "../context/MovieContext";
import TrendingToggle from "../components/TrendingToggle";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import "../css/Home.css";

function Home() {
  // Get global context
  const { recommendationsMode, setRecommendations, clearRecommendations } =
    useMovieContext();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [timeWindow, setTimeWindow] = useState("week");
  const [recommendationsTitle, setRecommendationsTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  /**
   * Loads movies based on search query or trending if no query
   * @param {string} query - Optional search query
   * @param {number} page - Optional page number
   */
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

  // Load initial trending movies on mount and when time window changes
  useEffect(() => {
    loadMovies();
  }, [timeWindow, loadMovies]);

  // Reset when leaving recommendations mode
  useEffect(() => {
    if (!recommendationsMode.active && movies.length === 0) {
      loadMovies();
    }
  }, [recommendationsMode.active, movies.length, loadMovies]);

  // Implement debounced search to avoid excessive API calls
  useEffect(() => {
    if (recommendationsMode.active) return; // Skip search when showing recommendations

    const timeoutId = setTimeout(() => {
      loadMovies(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadMovies, recommendationsMode.active]);

  /**
   * Updates the movie list with similar recommendations
   * @param {Array} similarMovies - Array of similar movie objects
   * @param {string} movieTitle - Title of the reference movie
   */
  const handleRecommendations = (similarMovies, movieTitle) => {
    setMovies(similarMovies);
    setRecommendations(true, `Similar to "${movieTitle}"`);
  };

  /**
   * Resets to trending movies view
   */
  const handleBackToTrending = () => {
    clearRecommendations();
    loadMovies();
    setSearchQuery("");
  };

  // Determine if we're in recommendations mode
  const isShowingRecommendations = !!recommendationsMode.active;

  return (
    <div className="home">
      {/* Recommendations header - only shown when viewing similar movies */}
      {isShowingRecommendations && (
        <div className="recommendations-header">
          <h2>{recommendationsMode.title}</h2>
          <button
            className="back-btn"
            onClick={handleBackToTrending}
            aria-label="Return to trending movies"
          >
            Back to Trending
          </button>
        </div>
      )}

      {/* Trending toggle - only shown when NOT viewing similar movies */}
      {!isShowingRecommendations && (
        <TrendingToggle
          timeWindow={timeWindow}
          onToggle={() =>
            setTimeWindow((prev) => (prev === "week" ? "day" : "week"))
          }
        />
      )}

      {/* Search bar - only shown when NOT viewing similar movies */}
      {!isShowingRecommendations && (
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          isSearching={isSearching}
        />
      )}

      {/* Movies display - always shown */}
      <MovieGrid
        movies={movies}
        error={error}
        loading={loading}
        onRecommendations={handleRecommendations}
      />

      {/* Pagination controls */}
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
