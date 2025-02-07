const axios = require('axios');

// TMDB genre mapping
const genreMapping = {
  'action': 28,
  'adventure': 12,
  'animation': 16,
  'comedy': 35,
  'crime': 80,
  'documentary': 99,
  'drama': 18,
  'family': 10751,
  'fantasy': 14,
  'history': 36,
  'horror': 27,
  'music': 10402,
  'mystery': 9648,
  'romance': 10749,
  'science fiction': 878,
  'sci-fi': 878,
  'tv movie': 10770,
  'thriller': 53,
  'war': 10752,
  'western': 37
};

async function getMovieDetails(movieTitles) {
  try {
    const movies = [];
    
    for (const title of movieTitles) {
      const response = await axios.get(`${process.env.TMDB_API_URL}/search/movie`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query: title,
          language: 'en-US',
          include_adult: false
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        const movie = response.data.results[0];
        
        const detailsResponse = await axios.get(
          `${process.env.TMDB_API_URL}/movie/${movie.id}`, {
            params: {
              api_key: process.env.TMDB_API_KEY,
              append_to_response: 'credits,keywords'
            }
          }
        );

        movies.push({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
          releaseDate: movie.release_date,
          voteAverage: movie.vote_average,
          genres: detailsResponse.data.genres,
          runtime: detailsResponse.data.runtime,
          director: detailsResponse.data.credits.crew
            .find(person => person.job === 'Director')?.name,
          cast: detailsResponse.data.credits.cast
            .slice(0, 3)
            .map(actor => actor.name)
        });
      }
    }

    if (movies.length === 0) {
      throw new Error('No movies found for the recommended titles');
    }

    return movies;
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    throw error;
  }
}

async function getSongRecommendations(genres) {
  // Implement Spotify API call
  const songs = [];
  // Add Spotify API implementation
  return songs;
}

async function getBookRecommendations(categories) {
  // Implement Google Books API call
  const books = [];
  for (const category of categories) {
    const response = await axios.get(`${process.env.GOOGLE_BOOKS_API_URL}`, {
      params: {
        q: `subject:${category}`,
        key: process.env.GOOGLE_BOOKS_API_KEY,
        maxResults: 1
      }
    });
    books.push(...response.data.items);
  }
  return books;
}

async function getExerciseRecommendations(types) {
  // Implement Exercise API call
  const exercises = [];
  // Add Exercise API implementation
  return exercises;
}

module.exports = {
  getMovieDetails,
  getSongRecommendations,
  getBookRecommendations,
  getExerciseRecommendations
}; 