/**
 * Favorites Page
 *
 * Displays the user's favorite movies or an empty state message
 */
import "../css/Favorites.css";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";

function Favorites() {
  const { favorites } = useMovieContext();
  const hasFavorites = favorites.length > 0;

  return (
    <div className={hasFavorites ? "favorites" : "favorites-empty"}>
      {hasFavorites ? (
        // Show favorites grid
        <>
          <h2>Favorite Movies</h2>
          <div className="movies-grid">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      ) : (
        // Show empty state
        <>
          <h2>No Favorite Movies Yet</h2>
          <p>
            Start adding movies to your favorites and they will appear here!
          </p>
        </>
      )}
    </div>
  );
}

export default Favorites;
