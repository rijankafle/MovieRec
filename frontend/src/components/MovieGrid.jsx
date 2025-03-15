/**
 * Grid component for displaying movie cards
 *
 * Handles loading and error states, and renders a grid of movie cards
 *
 * @param {Array} movies - Array of movie objects to display
 * @param {string} error - Error message to display if any
 * @param {boolean} loading - Loading state flag
 * @param {function} onRecommendations - Handler for movie recommendations
 * @returns {JSX.Element} Grid of movies or appropriate status message
 */
import MovieCard from "./MovieCard";

function MovieGrid({ movies, error, loading, onRecommendations }) {
  // Loading state
  if (loading) {
    return (
      <div className="loading-overlay" aria-live="polite">
        <div className="loading-spinner" role="status">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <p className="error-message" role="alert" aria-live="assertive">
        {error}
      </p>
    );
  }

  // Render movie grid
  return (
    <div className="movies-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onRecommendations={onRecommendations}
        />
      ))}
    </div>
  );
}

export default MovieGrid;
