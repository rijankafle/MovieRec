import MovieCard from './MovieCard';

function MovieGrid({ movies, error, loading, onRecommendations }) {
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

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