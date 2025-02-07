function generateMoviePrompt(stressEntryPercentage, pastLikings = null) {
  let prompt = `As a movie recommendation system, suggest 10 diverse movies for a user whose diary shows ${stressEntryPercentage}% stress entries. `;

  if (pastLikings?.favoriteMovies?.length > 0) {
    prompt += `Consider their favorite movies: ${JSON.stringify(pastLikings.favoriteMovies)}, but ensure variety. `;
  }

  if (stressEntryPercentage >= 40) {
    prompt += `Since stress is significant, recommend calming yet diverse movies that:
    1. Mix genres (comedy, drama, animation, etc.)
    2. Include both recent and classic films
    3. Balance mainstream and independent movies
    4. Feature uplifting and peaceful narratives
    5. Focus on positive themes and gentle storytelling`;
  } else {
    prompt += `Since the mood is mostly positive, recommend engaging and diverse movies that:
    1. Span multiple genres (adventure, sci-fi, biography, etc.)
    2. Mix contemporary and classic selections
    3. Include both blockbusters and acclaimed films
    4. Feature inspiring and thought-provoking content
    5. Offer unique and engaging narratives`;
  }

  prompt += ` Return a clean JSON object in this exact format without any comments or explanations: {"movies": ["Movie Title 1", "Movie Title 2", "Movie Title 3", "Movie Title 4", "Movie Title 5", "Movie Title 6", "Movie Title 7", "Movie Title 8", "Movie Title 9", "Movie Title 10"]}`;

  return prompt;
}

function generateBookPrompt(stressEntryPercentage, pastLikings = null) {
  let prompt = `As a book recommendation system, suggest 10 diverse books for a user whose diary shows ${stressEntryPercentage}% stress entries. `;

  if (pastLikings?.favoriteBooks?.length > 0) {
    prompt += `Consider their favorite books: ${JSON.stringify(pastLikings.favoriteBooks)}, but ensure variety. `;
  }

  if (stressEntryPercentage >= 40) {
    prompt += `Since stress is significant, recommend calming yet diverse books that:
    1. Mix genres (mindfulness, light fiction, self-help, etc.)
    2. Include both contemporary and classic works
    3. Balance popular and literary works
    4. Feature uplifting and peaceful narratives
    5. Focus on personal growth and emotional well-being`;
  } else {
    prompt += `Since the mood is mostly positive, recommend engaging and diverse books that:
    1. Span multiple genres (adventure, biography, fantasy, etc.)
    2. Mix recent bestsellers and timeless classics
    3. Include both fiction and non-fiction
    4. Feature inspiring and thought-provoking content
    5. Offer unique perspectives and engaging narratives`;
  }

  prompt += ` Return a clean JSON object in this exact format without any comments or explanations: {"books": ["Title 1 by Author 1", "Title 2 by Author 2", "Title 3 by Author 3", "Title 4 by Author 4", "Title 5 by Author 5", "Title 6 by Author 6", "Title 7 by Author 7", "Title 8 by Author 8", "Title 9 by Author 9", "Title 10 by Author 10"]}`;

  return prompt;
}

function generateMusicPrompt(stressEntryPercentage, pastLikings = null) {
  let prompt = `As a music recommendation system, suggest 10 diverse songs for a user whose diary shows ${stressEntryPercentage}% stress entries. `;

  if (pastLikings?.favoriteSongs?.length > 0) {
    prompt += `Consider their favorite songs: ${JSON.stringify(pastLikings.favoriteSongs)}, but ensure variety. `;
  }

  if (stressEntryPercentage >= 40) {
    prompt += `Since stress is significant, recommend calming yet diverse songs that:
    1. Mix genres (classical, ambient, acoustic, etc.)
    2. Include both contemporary and timeless pieces
    3. Balance popular and indie artists
    4. Feature soothing melodies and rhythms
    5. Focus on peaceful and uplifting compositions`;
  } else {
    prompt += `Since the mood is mostly positive, recommend engaging and diverse songs that:
    1. Span multiple genres (pop, rock, electronic, etc.)
    2. Mix current hits and classic favorites
    3. Include both mainstream and independent artists
    4. Feature energetic and inspiring rhythms
    5. Offer unique and mood-boosting elements`;
  }

  prompt += ` Return a clean JSON object in this exact format without any comments or explanations: {"songs": ["Song Title 1 by Artist 1", "Song Title 2 by Artist 2", "Song Title 3 by Artist 3", "Song Title 4 by Artist 4", "Song Title 5 by Artist 5", "Song Title 6 by Artist 6", "Song Title 7 by Artist 7", "Song Title 8 by Artist 8", "Song Title 9 by Artist 9", "Song Title 10 by Artist 10"]}`;

  return prompt;
}

module.exports = {
  generateMoviePrompt,
  generateBookPrompt,
  generateMusicPrompt
}; 
