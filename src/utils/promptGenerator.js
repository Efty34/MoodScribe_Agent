function generateMoviePrompt(stressEntryPercentage, pastLikings = null) {
  // Randomly select different tones and themes based on stress levels
  const calmingThemes = [
    "gentle storytelling with serene visuals",
    "uplifting tales of human connection",
    "heartwarming stories with positive resolutions",
    "peaceful narratives set in beautiful landscapes",
    "inspirational journeys of self-discovery",
  ];

  const engagingThemes = [
    "captivating adventures with unexpected twists",
    "thought-provoking sci-fi exploring futuristic ideas",
    "biographical dramas highlighting resilience and triumph",
    "mystical fantasy worlds filled with wonder",
    "historical epics showcasing courage and determination",
  ];

  const calmingGenres = [
    "comedy",
    "drama",
    "animation",
    "romance",
    "documentary",
  ];
  const engagingGenres = [
    "adventure",
    "sci-fi",
    "biography",
    "fantasy",
    "thriller",
  ];

  // Randomly shuffle arrays to ensure variety
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Select random themes and genres based on stress level
  const selectedCalmingThemes = shuffleArray(calmingThemes)
    .slice(0, 3)
    .join(", ");
  const selectedEngagingThemes = shuffleArray(engagingThemes)
    .slice(0, 3)
    .join(", ");
  const selectedCalmingGenres = shuffleArray(calmingGenres)
    .slice(0, 3)
    .join(", ");
  const selectedEngagingGenres = shuffleArray(engagingGenres)
    .slice(0, 3)
    .join(", ");

  let prompt = `As a movie recommendation system, suggest 10 diverse movies for a user whose diary shows ${stressEntryPercentage}% stress entries. `;

  if (pastLikings?.favoriteMovies?.length > 0) {
    prompt += `Take into account their favorite movies: ${JSON.stringify(
      pastLikings.favoriteMovies
    )}, but ensure variety and avoid repetition. `;
  }

  if (stressEntryPercentage >= 40) {
    prompt += `Since stress is significant, recommend calming yet diverse movies that:
    1. Focus on ${selectedCalmingThemes}
    2. Include genres like ${selectedCalmingGenres}
    3. Mix both recent releases and timeless classics
    4. Balance mainstream hits with lesser-known gems
    5. Offer gentle, uplifting, and peaceful narratives`;
  } else {
    prompt += `Since the mood is mostly positive, recommend engaging and diverse movies that:
    1. Explore ${selectedEngagingThemes}
    2. Span genres like ${selectedEngagingGenres}
    3. Combine contemporary blockbusters with critically acclaimed classics
    4. Feature inspiring, thought-provoking, and unique storytelling
    5. Provide a mix of high-energy and reflective narratives`;
  }

  prompt += ` Return ONLY a clean JSON object in this exact format without any comments, explanations, or special characters. Use only ASCII characters and no backslashes or escaped quotes: {"movies": ["Movie Title 1", "Movie Title 2", "Movie Title 3", "Movie Title 4", "Movie Title 5", "Movie Title 6", "Movie Title 7", "Movie Title 8", "Movie Title 9", "Movie Title 10"]}`;

  return prompt;
}

function generateBookPrompt(stressEntryPercentage, pastLikings = null) {
  // Randomly select different tones and themes based on stress levels
  const calmingThemes = [
    "gentle narratives with serene settings",
    "uplifting stories of personal growth",
    "heartwarming tales of friendship and kindness",
    "peaceful journeys of self-discovery",
    "inspirational memoirs with positive messages",
  ];

  const engagingThemes = [
    "captivating adventures with unexpected twists",
    "thought-provoking explorations of human nature",
    "biographical accounts of resilience and triumph",
    "mystical worlds filled with wonder and magic",
    "historical epics showcasing courage and determination",
  ];

  const calmingGenres = [
    "mindfulness",
    "light fiction",
    "self-help",
    "poetry",
    "nature writing",
  ];
  const engagingGenres = [
    "adventure",
    "biography",
    "fantasy",
    "science fiction",
    "thriller",
  ];

  // Randomly shuffle arrays to ensure variety
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Select random themes and genres based on stress level
  const selectedCalmingThemes = shuffleArray(calmingThemes)
    .slice(0, 3)
    .join(", ");
  const selectedEngagingThemes = shuffleArray(engagingThemes)
    .slice(0, 3)
    .join(", ");
  const selectedCalmingGenres = shuffleArray(calmingGenres)
    .slice(0, 3)
    .join(", ");
  const selectedEngagingGenres = shuffleArray(engagingGenres)
    .slice(0, 3)
    .join(", ");

  let prompt = `As a book recommendation system, suggest 10 diverse books for a user whose diary shows ${stressEntryPercentage}% stress entries. `;

  if (pastLikings?.favoriteBooks?.length > 0) {
    prompt += `Take into account their favorite books: ${JSON.stringify(
      pastLikings.favoriteBooks
    )}, but ensure variety and avoid repetition. `;
  }

  if (stressEntryPercentage >= 40) {
    prompt += `Since stress is significant, recommend calming yet diverse books that:
    1. Focus on ${selectedCalmingThemes}
    2. Include genres like ${selectedCalmingGenres}
    3. Mix both contemporary works and timeless classics
    4. Balance popular reads with literary gems
    5. Offer gentle, uplifting, and peaceful narratives`;
  } else {
    prompt += `Since the mood is mostly positive, recommend engaging and diverse books that:
    1. Explore ${selectedEngagingThemes}
    2. Span genres like ${selectedEngagingGenres}
    3. Combine recent bestsellers with critically acclaimed classics
    4. Feature inspiring, thought-provoking, and unique storytelling
    5. Provide a mix of high-energy and reflective narratives`;
  }

  prompt += ` Return ONLY a clean JSON object in this exact format without any comments, explanations, or special characters. Use only ASCII characters and no backslashes or escaped quotes: {"books": ["Title 1 by Author 1", "Title 2 by Author 2", "Title 3 by Author 3", "Title 4 by Author 4", "Title 5 by Author 5", "Title 6 by Author 6", "Title 7 by Author 7", "Title 8 by Author 8", "Title 9 by Author 9", "Title 10 by Author 10"]}`;

  return prompt;
}

function generateMusicPrompt(stressEntryPercentage, pastLikings = null) {
  // Randomly select different tones and themes based on stress levels
  const calmingThemes = [
    "gentle melodies with serene harmonies",
    "uplifting tunes with positive lyrics",
    "peaceful instrumentals with soothing rhythms",
    "ambient soundscapes for relaxation",
    "acoustic songs with heartfelt storytelling",
  ];

  const engagingThemes = [
    "energetic beats with catchy hooks",
    "inspiring anthems with powerful vocals",
    "danceable tracks with vibrant synths",
    "rocking guitar riffs with emotional depth",
    "experimental sounds with unique production",
  ];

  const calmingGenres = [
    "classical",
    "ambient",
    "acoustic",
    "lo-fi",
    "new age",
  ];
  const engagingGenres = ["pop", "rock", "electronic", "hip-hop", "indie"];

  // Randomly shuffle arrays to ensure variety
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Select random themes and genres based on stress level
  const selectedCalmingThemes = shuffleArray(calmingThemes)
    .slice(0, 3)
    .join(", ");
  const selectedEngagingThemes = shuffleArray(engagingThemes)
    .slice(0, 3)
    .join(", ");
  const selectedCalmingGenres = shuffleArray(calmingGenres)
    .slice(0, 3)
    .join(", ");
  const selectedEngagingGenres = shuffleArray(engagingGenres)
    .slice(0, 3)
    .join(", ");

  let prompt = `As a music recommendation system, suggest 10 diverse songs for a user whose diary shows ${stressEntryPercentage}% stress entries. `;

  if (pastLikings?.favoriteSongs?.length > 0) {
    prompt += `Take into account their favorite songs: ${JSON.stringify(
      pastLikings.favoriteSongs
    )}, but ensure variety and avoid repetition. `;
  }

  if (stressEntryPercentage >= 40) {
    prompt += `Since stress is significant, recommend calming yet diverse songs that:
    1. Focus on ${selectedCalmingThemes}
    2. Include genres like ${selectedCalmingGenres}
    3. Mix both contemporary and timeless pieces
    4. Balance popular and indie artists
    5. Offer soothing melodies and peaceful compositions`;
  } else {
    prompt += `Since the mood is mostly positive, recommend engaging and diverse songs that:
    1. Explore ${selectedEngagingThemes}
    2. Span genres like ${selectedEngagingGenres}
    3. Combine current hits with classic favorites
    4. Feature energetic and inspiring rhythms
    5. Provide a mix of mainstream and independent artists`;
  }

  prompt += ` Return ONLY a clean JSON object in this exact format without any comments, explanations, or special characters. Use only ASCII characters and no backslashes or escaped quotes: {"songs": ["Song Title 1 by Artist 1", "Song Title 2 by Artist 2", "Song Title 3 by Artist 3", "Song Title 4 by Artist 4", "Song Title 5 by Artist 5", "Song Title 6 by Artist 6", "Song Title 7 by Artist 7", "Song Title 8 by Artist 8", "Song Title 9 by Artist 9", "Song Title 10 by Artist 10"]}`;

  return prompt;
}

function generateExercisePrompt(stressEntryPercentage, pastLikings = null) {
  // Randomly select different tones and themes based on stress levels
  const calmingExerciseTypes = [
    "yoga",
    "tai chi",
    "meditation",
    "stretching",
    "walking",
  ];

  const engagingExerciseTypes = [
    "HIIT",
    "cycling",
    "dancing",
    "strength training",
    "kickboxing",
  ];

  const calmingBenefits = [
    "reduces stress",
    "improves mental clarity",
    "enhances flexibility",
    "promotes relaxation",
    "boosts mindfulness",
  ];

  const engagingBenefits = [
    "increases energy",
    "builds strength",
    "improves endurance",
    "burns calories",
    "boosts cardiovascular health",
  ];

  const locations = ["indoor", "outdoor"];
  const intensities = ["low", "moderate", "high"];

  // Randomly shuffle arrays to ensure variety
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Select random themes and genres based on stress level
  const selectedCalmingExercises = shuffleArray(calmingExerciseTypes).slice(
    0,
    3
  );
  const selectedEngagingExercises = shuffleArray(engagingExerciseTypes).slice(
    0,
    3
  );
  const selectedCalmingBenefits = shuffleArray(calmingBenefits).slice(0, 3);
  const selectedEngagingBenefits = shuffleArray(engagingBenefits).slice(0, 3);

  let prompt = `As an exercise recommendation system, suggest 5 diverse exercises for a user whose diary shows ${stressEntryPercentage}% stress entries. `;

  if (pastLikings?.favoriteExercises?.length > 0) {
    prompt += `Take into account their favorite exercises: ${JSON.stringify(
      pastLikings.favoriteExercises
    )}, but ensure variety and avoid repetition. `;
  }

  if (stressEntryPercentage >= 40) {
    prompt += `Since stress is significant, recommend calming yet effective exercises that focus on stress relief and mental well-being. Suggest exercises like ${selectedCalmingExercises.join(
      ", "
    )}, with benefits such as ${selectedCalmingBenefits.join(", ")}.`;
  } else {
    prompt += `Since the mood is mostly positive, recommend engaging and energetic exercises that span multiple workout types. Suggest exercises like ${selectedEngagingExercises.join(
      ", "
    )}, with benefits such as ${selectedEngagingBenefits.join(", ")}.`;
  }

  prompt += ` Return ONLY a JSON object in this format - NO markdown, NO comments, NO special characters, NO backslashes or escaped quotes:
  {
    "exercises": [
      {
        "name": "simple exercise name",
        "type": "simple category name",
        "duration": "${Math.floor(Math.random() * 30 + 10)}",
        "intensity": "${shuffleArray(intensities)[0]}",
        "description": "brief description",
        "benefits": ["benefit1", "benefit2"],
        "equipment": [],
        "instructions": ["step1", "step2"],
        "caloriesBurnedPerHour": "${Math.floor(Math.random() * 300 + 100)}",
        "suitable": ["beginners"],
        "location": "${shuffleArray(locations)[0]}"
      }
    ]
  }`;

  return prompt;
}

module.exports = {
  generateMoviePrompt,
  generateBookPrompt,
  generateMusicPrompt,
  generateExercisePrompt,
};
