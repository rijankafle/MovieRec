import { useState } from "react";
import "../css/MovieCard.css";
import { useMovieContext } from "../context/MovieContext";
import { getMovieRecommendations } from "../services/api";

function MovieCard({ movie, onRecommendations }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const [isLoading, setIsLoading] = useState(false);
  const favorite = isFavorite(movie.id);

  function onFavoriteClick(e) {
    e.preventDefault();
    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  }

  async function onRecommendClick(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const recommendedMovies = await getMovieRecommendations(movie.id);
      onRecommendations(recommendedMovies, movie.title);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-overlay">
          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>
              {movie.release_date
                ? new Date(movie.release_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })
                : ""}
            </p>
          </div>
        </div>
      </div>
      <div className="button-group">
        <button
          className={`favorite-btn ${favorite ? "active" : ""}`}
          onClick={onFavoriteClick}
          title={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          ♥
        </button>
        <button
          className={`recommend-btn ${isLoading ? "loading" : ""}`}
          onClick={onRecommendClick}
          title="Get similar movies"
          disabled={isLoading}
        >
          {isLoading ? "..." : "☆"}
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
