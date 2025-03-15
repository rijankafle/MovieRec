/**
 * MovieCard Component - Clean Icon Version
 *
 * Uses standalone icons without backgrounds
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
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { favorites, addToFavorites, removeFromFavorites } = useMovieContext();
  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  // Handle favorite toggle
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  // Get recommendations when requested
  const handleGetSimilar = async (e) => {
    e.stopPropagation();
    if (!onRecommendations) return;

    try {
      const recommendations = await getMovieRecommendations(movie.id);
      onRecommendations(recommendations, movie.title);
    } catch (error) {
      console.error("Error getting recommendations:", error);
    }
  };

  return (
    <>
      <div
        className={`movie-card ${isHovered ? "hovered" : ""}`}
        onClick={() => setShowDetails(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Movie poster with clean overlay icons */}
        <div className="movie-poster">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
            />
          ) : (
            <div className="no-poster">No Image</div>
          )}

          {/* Clean standalone icons */}
          <div className="card-actions">
            <button
              className={`clean-icon favorite-icon ${
                isFavorite ? "is-favorite" : ""
              }`}
              onClick={handleFavoriteClick}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <FontAwesomeIcon
                icon={isFavorite ? fasHeart : farHeart}
                className="icon-heart"
              />
            </button>

            {onRecommendations && (
              <button
                className="clean-icon similar-icon"
                onClick={handleGetSimilar}
                aria-label="Find similar movies"
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="icon-search"
                />
              </button>
            )}
          </div>

          {/* Hover overlay */}
          <div className="movie-overlay">
            <span className="view-details">View Details</span>
          </div>
        </div>

        {/* Movie details */}
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

      {/* Movie Details Modal */}
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
