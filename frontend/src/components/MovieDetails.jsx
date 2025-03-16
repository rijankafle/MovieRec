/**
 * Detailed movie information modal
 */
import { useState, useEffect } from "react";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
} from "../services/api";
import { useMovieContext } from "../context/MovieContext";
import "../css/MovieDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faClock,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

function MovieDetails({ movieId, onClose }) {
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, addToFavorites, removeFromFavorites } = useMovieContext();

  const isFavorite = favorites.some((fav) => fav.id === movieId);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const [movieData, creditsData, videosData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
          getMovieVideos(movieId),
        ]);

        setMovie(movieData);
        setCredits(creditsData);
        setVideos(
          videosData.results.filter(
            (video) => video.site === "YouTube" && video.type === "Trailer"
          )
        );
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(movieId);
    } else if (movie) {
      addToFavorites(movie);
    }
  };

  if (loading) {
    return (
      <div className="movie-details-modal">
        <div className="modal-content loading">
          <div className="loading-spinner">Loading details...</div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const trailer = videos.length > 0 ? videos[0] : null;

  return (
    <div className="movie-details-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>
            {movie.title}{" "}
            {movie.release_date && (
              <span>({movie.release_date.substring(0, 4)})</span>
            )}
          </h2>
          <button
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={toggleFavorite}
          >
            {isFavorite ? "❤️ Favorite" : "🤍 Add to Favorites"}
          </button>
        </div>

        <div className="movie-info-grid">
          <div className="movie-poster">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={`${movie.title} poster`}
              />
            ) : (
              <div className="no-poster">No poster available</div>
            )}
          </div>

          <div className="movie-details">
            {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}

            <div className="movie-meta">
              <span>
                <FontAwesomeIcon icon={faStar} className="icon-star" />
                {movie.vote_average.toFixed(1)}/10
              </span>
              <span>
                <FontAwesomeIcon icon={faClock} />
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
              <span>
                <FontAwesomeIcon icon={faCalendarDays} />
                {new Date(movie.release_date).toLocaleDateString()}
              </span>
            </div>

            <div className="genres">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>

            <h3>Overview</h3>
            <p className="overview">
              {movie.overview || "No overview available."}
            </p>

            {credits && (
              <>
                <h3>Cast</h3>
                <div className="cast-list">
                  {credits.cast.slice(0, 6).map((person) => (
                    <div key={person.id} className="cast-member">
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                          alt={person.name}
                        />
                      ) : (
                        <div className="no-profile">No image</div>
                      )}
                      <div className="cast-name">{person.name}</div>
                      <div className="cast-character">{person.character}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {trailer && (
          <div className="trailer-section">
            <h3>Trailer</h3>
            <div className="video-container">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`${movie.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;
