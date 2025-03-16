/**
 * MovieCard Component
 *
 * Displays a movie with:
 * - Poster image
 * - Title and metadata
 * - Favorite toggle
 * - Similar movies button (optional)
 */
import { useState } from "react";
import { useMovieContext } from "../context/MovieContext";
import { getMovieRecommendations } from "../services/api";
import MovieDetails from "./MovieDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as fasHeart,
  faMagnifyingGlass,
  faStar,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import "../css/MovieCard.css";

function MovieCard({ movie, onRecommendations }) {
  // State
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Context
  const { favorites, addToFavorites, removeFromFavorites } = useMovieContext();
  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  // Event handlers
  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleSimilarMoviesClick = async (e) => {
    e.stopPropagation();
    if (!onRecommendations) return;

    try {
      const recommendations = await getMovieRecommendations(movie.id);
      onRecommendations(recommendations, movie.title);
    } catch (error) {
      console.error("Error getting recommendations:", error);
    }
  };

  // Render movie card
  return (
    <>
      <div
        className={`movie-card ${isHovered ? "hovered" : ""}`}
        onClick={() => setShowDetails(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Poster */}
        <div className="movie-poster">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
            />
          ) : (
            <div className="no-poster">No Image</div>
          )}

          {/* Action buttons */}
          <div className="card-actions">
            {/* Favorite button */}
            <button
              className={`clean-icon favorite-icon ${
                isFavorite ? "is-favorite" : ""
              }`}
              onClick={handleFavoriteToggle}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <FontAwesomeIcon
                icon={isFavorite ? fasHeart : farHeart}
                className="icon-heart"
              />
            </button>

            {/* Similar movies button (conditionally rendered) */}
            {onRecommendations && (
              <button
                className="clean-icon similar-icon"
                onClick={handleSimilarMoviesClick}
                aria-label="Find similar movies"
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="icon-search"
                />
              </button>
            )}
          </div>

          {/* View details overlay */}
          <div className="movie-overlay">
            <span className="view-details">View Details</span>
          </div>
        </div>

        {/* Movie metadata */}
        <div className="movie-details">
          <h3 className="movie-title">{movie.title}</h3>
          <div className="movie-meta">
            <span className="rating">
              <FontAwesomeIcon icon={faStar} className="icon-star" />
              {movie.vote_average.toFixed(1)}
            </span>
            {movie.release_date && (
              <span className="year">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className="icon-calendar"
                />
                {new Date(movie.release_date).getFullYear()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details modal (conditionally rendered) */}
      {showDetails && (
        <MovieDetails
          movieId={movie.id}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
}

export default MovieCard;
