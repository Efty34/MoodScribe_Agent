const {
  generateMoviePrompt,
  generateBookPrompt,
  generateMusicPrompt,
  generateExercisePrompt,
} = require("../utils/promptGenerator");
const { getGroqRecommendations } = require("../services/groqService");
const { getMovieDetails } = require("../services/apiServices");
const { getBookDetails } = require("../services/bookService");
const { getMusicDetails } = require("../services/musicService");

async function getCombinedRecommendations(req, res) {
  try {
    const {
      totalEntries,
      totalStressEntries,
      totalNoStressEntries,
      predictedAspectCounts = {},
      pastLikings = null,
    } = req.body;

    // Validate input
    if (typeof totalEntries !== "number" || totalEntries <= 0) {
      return res.status(400).json({
        error: "Invalid totalEntries. Must be a positive number.",
      });
    }

    if (typeof totalStressEntries !== "number" || totalStressEntries < 0) {
      return res.status(400).json({
        error: "Invalid totalStressEntries. Must be a non-negative number.",
      });
    }

    // Calculate stress percentage
    const stressEntryPercentage = (totalStressEntries / totalEntries) * 100;

    const moviePreferences = pastLikings
      ? {
          favoriteMovies: pastLikings.favoriteMovies || [],
        }
      : null;

    const bookPreferences = pastLikings
      ? {
          favoriteBooks: pastLikings.favoriteBooks || [],
        }
      : null;

    const musicPreferences = pastLikings
      ? {
          favoriteSongs: pastLikings.favoriteSongs || [],
        }
      : null;

    const exercisePreferences = pastLikings
      ? {
          favoriteExercises: pastLikings.favoriteExercises || [],
        }
      : null;

    const [
      movieRecommendations,
      bookRecommendations,
      musicRecommendations,
      exerciseRecommendations,
    ] = await Promise.all([
      getGroqRecommendations(
        generateMoviePrompt(
          stressEntryPercentage,
          moviePreferences,
          predictedAspectCounts
        )
      ),
      getGroqRecommendations(
        generateBookPrompt(
          stressEntryPercentage,
          bookPreferences,
          predictedAspectCounts
        )
      ),
      getGroqRecommendations(
        generateMusicPrompt(
          stressEntryPercentage,
          musicPreferences,
          predictedAspectCounts
        )
      ),
      getGroqRecommendations(
        generateExercisePrompt(
          stressEntryPercentage,
          exercisePreferences,
          predictedAspectCounts
        )
      ),
    ]);

    const [movies, books, songs] = await Promise.all([
      getMovieDetails(movieRecommendations.movies),
      getBookDetails(bookRecommendations.books),
      getMusicDetails(musicRecommendations.songs),
    ]);

    res.json({
      movies,
      books,
      songs,
      exercises: exerciseRecommendations.exercises,
      analysisContext: {
        totalEntries,
        totalStressEntries,
        totalNoStressEntries,
        stressEntryPercentage: Math.round(stressEntryPercentage * 100) / 100,
        nonStressEntryPercentage:
          Math.round((100 - stressEntryPercentage) * 100) / 100,
        predictedAspectCounts,
        recommendationType:
          stressEntryPercentage >= 40
            ? "stress-relief"
            : "positive-enhancement",
        personalizedRecommendations: {
          movies: Boolean(moviePreferences?.favoriteMovies?.length > 0),
          books: Boolean(bookPreferences?.favoriteBooks?.length > 0),
          songs: Boolean(musicPreferences?.favoriteSongs?.length > 0),
          exercises: Boolean(
            exercisePreferences?.favoriteExercises?.length > 0
          ),
        },
      },
    });
  } catch (error) {
    console.error("Error in combined recommendations:", error.message);
    res.status(500).json({
      error: "Failed to get recommendations",
      details: error.message,
    });
  }
}

module.exports = {
  getCombinedRecommendations,
};
