/**
 * API service module for The Movie Database (TMDB)
 * 
 * Contains methods for fetching movies from different endpoints
 */

// API configuration
const API_KEY = "cfe3ec0fcc859bf1e1f443c198f7de20";
const API_URL = "https://api.themoviedb.org/3";

/**
 * Generic fetch function for movie endpoints
 * 
 * @param {string} endpoint - API endpoint path
 * @returns {Promise<Array>} - Array of movie results
 */
const fetchMovies = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

/**
 * Fetches popular movies
 * @returns {Promise<Array>} Array of popular movies
 */
export const getPopularMovies = async () => {
  try {
    const response = await fetch(`${API_URL}/movie/popular?api_key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
};

/**
 * Fetches movie genres list
 * @returns {Promise<Array>} Array of genre objects
 */
export const getGenres = async () => {
  try {
    const response = await fetch(`${API_URL}/genre/movie/list?api_key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

/**
 * Gets detailed information for a specific movie
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} Detailed movie information
 */
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `${API_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=watch/providers`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

/**
 * Gets cast and crew information for a movie
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} Movie credits data
 */
export const getMovieCredits = async (movieId) => {
  try {
    const response = await fetch(`${API_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    throw error;
  }
};

/**
 * Gets videos (trailers, teasers) for a movie
 * @param {number} movieId - Movie ID
 * @returns {Promise<Object>} Movie videos data
 */
export const getMovieVideos = async (movieId) => {
  try {
    const response = await fetch(`${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    throw error;
  }
};

/**
 * Updates searchMovies to support pagination and filtering
 * @param {string} query - Search term
 * @param {number} page - Page number for results
 * @param {Array} withGenres - Optional array of genre IDs to filter by
 * @returns {Promise<Object>} Search results with pagination info
 */
export const searchMovies = async (query, page = 1, withGenres = []) => {
  try {
    let endpoint = `/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    
    if (withGenres.length > 0) {
      endpoint += `&with_genres=${withGenres.join(',')}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

/**
 * Fetches trending movies for a given time window
 * @param {string} timeWindow - Time window for trending movies ('day' or 'week')
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} Trending movies data sorted by rating
 */
export const getTrendingMovies = async (timeWindow = 'week', page = 1) => {
  try {
    const response = await fetch(
      `${API_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Sort movies by rating (vote_average) in descending order
    data.results.sort((a, b) => {
      // If vote count is too low, reduce the rating's weight
      const getWeightedRating = (movie) => {
        const minVotes = 100; // Minimum votes threshold
        if (movie.vote_count < minVotes) {
          return movie.vote_average * (movie.vote_count / minVotes);
        }
        return movie.vote_average;
      };

      const ratingA = getWeightedRating(a);
      const ratingB = getWeightedRating(b);
      
      return ratingB - ratingA;
    });

    return data;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};

/**
 * Fetches similar movies for a given movie ID
 * @param {number} movieId - Movie ID to find similar content for
 * @returns {Promise<Array>} Similar movies
 */
export const getSimilarMovies = (movieId) => 
  fetchMovies(`/movie/${movieId}/similar?api_key=${API_KEY}`);

/**
 * Gets comprehensive movie recommendations by combining similar movies
 * and recommendations endpoints
 * 
 * @param {number} movieId - Movie ID to get recommendations for
 * @returns {Promise<Array>} Combined and ranked recommendations
 */
export const getMovieRecommendations = async (movieId) => {
  try {
    // Fetch both similar movies and recommendations in parallel
    const [similarResponse, recommendationsResponse] = await Promise.all([
      fetch(`${API_URL}/movie/${movieId}/similar?api_key=${API_KEY}`),
      fetch(`${API_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}`)
    ]);

    // Check for response errors
    if (!similarResponse.ok || !recommendationsResponse.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    // Parse JSON responses in parallel
    const [similarData, recommendationsData] = await Promise.all([
      similarResponse.json(),
      recommendationsResponse.json()
    ]);

    // Combine results from both endpoints
    const allMovies = [
      ...(similarData.results || []), 
      ...(recommendationsData.results || [])
    ];

    // Deduplicate movies by ID
    const uniqueMovies = Array.from(
      new Map(allMovies.map(movie => [movie.id, movie])).values()
    );

    // Sort by weighted score of popularity and rating
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
