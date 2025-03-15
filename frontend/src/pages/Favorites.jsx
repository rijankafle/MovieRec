import "../css/Favorites.css";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";

/**
 * Favorites page component that displays user's favorite movies
 * 
 * @returns {JSX.Element} Favorites page with grid of favorite movies
 */
function Favorite() {
  // Get favorites from context
  const { favorites } = useMovieContext();
  
  // If there are favorites, display them
  if (favorites && favorites.length > 0) {
    return (
      <div className="favorites">
        <h2>Favorite Movies</h2>
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    );
  }

  // If no favorites, show empty state
  return (
    <div className="favorites-empty">
      <h2>No Favorite Movies Yet</h2>
      <p>Start adding movies to your favorites and they will appear here!</p>
    </div>
  );
}

export default Favorite;
