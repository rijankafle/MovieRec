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
