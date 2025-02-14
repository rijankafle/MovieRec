const API_KEY = "cfe3ec0fcc859bf1e1f443c198f7de20";
const API_URL = "https://api.themoviedb.org/3";

const fetchMovies = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const getPopularMovies = async () => {
  const response = await fetch(`${API_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = (query) => 
  fetchMovies(`/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);

export const getTrendingMovies = (timeWindow = 'week') => 
  fetchMovies(`/trending/movie/${timeWindow}?api_key=${API_KEY}`);

export const getSimilarMovies = (movieId) => 
  fetchMovies(`/movie/${movieId}/similar?api_key=${API_KEY}`);

// Get both similar movies and recommendations
export const getMovieRecommendations = async (movieId) => {
  try {
    // Fetch both similar movies and recommendations in parallel
    const [similarResponse, recommendationsResponse] = await Promise.all([
      fetch(`${API_URL}/movie/${movieId}/similar?api_key=${API_KEY}`),
      fetch(`${API_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}`)
    ]);

    const [similarData, recommendationsData] = await Promise.all([
      similarResponse.json(),
      recommendationsResponse.json()
    ]);

    // Combine and deduplicate results
    const allMovies = [...similarData.results, ...recommendationsData.results];
    const uniqueMovies = Array.from(new Map(
      allMovies.map(movie => [movie.id, movie])
    ).values());

    // Sort by popularity and vote average
    return uniqueMovies
      .sort((a, b) => {
        const scoreA = (a.popularity * 0.6) + (a.vote_average * 0.4);
        const scoreB = (b.popularity * 0.6) + (b.vote_average * 0.4);
        return scoreB - scoreA;
      })
      .slice(0, 20); // Return top 20 recommendations

  } catch (error) {
    console.error("Error fetching movie recommendations:", error);
    throw error;
  }
};
