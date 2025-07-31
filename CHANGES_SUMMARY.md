# MoodScribe Recommendation AI Agent - Changes Summary

## Updated Request Body Structure

The API now accepts the following request body format:

```json
{
  "totalEntries": 25,
  "totalStressEntries": 8,
  "totalNoStressEntries": 17,
  "predictedAspectCounts": {
    "Financial Stress": 3,
    "Health & Well-being": 2,
    "Relationships & Family": 2,
    "Severe Trauma": 1
  },
  "pastLikings": {
    "favoriteMovies": ["Movie1", "Movie2"],
    "favoriteBooks": ["Book1"],
    "favoriteSongs": ["Song1", "Song2"]
  }
}
```

## Key Changes Made

### 1. Updated Controllers (`src/controllers/recommendationController.js`)

#### Changes:

- **Input Validation**: Now validates `totalEntries` and `totalStressEntries` instead of `stressEntryPercentage`
- **Automatic Calculation**: Calculates stress percentage from `totalStressEntries / totalEntries * 100`
- **Enhanced Context**: Added `predictedAspectCounts` parameter to all prompt generation calls
- **Improved Response**: Returns more detailed analysis context including all entry counts

#### Functions Updated:

- `getMovieRecommendations()`
- `getBookRecommendations()`
- `getMusicRecommendations()`
- `getExerciseRecommendations()`
- `getCombinedRecommendations()`

### 2. Enhanced Prompt Generator (`src/utils/promptGenerator.js`)

#### New Features:

- **Aspect-Based Recommendations**: Incorporates `predictedAspectCounts` for targeted suggestions
- **Smart Prioritization**: Sorts aspects by frequency and focuses on top 3 stress areas
- **Contextual Mapping**: Maps stress aspects to specific recommendation strategies

#### Aspect-Based Recommendation Mapping:

**Movies:**

- Financial Stress → Financial recovery stories, entrepreneurship journeys
- Health & Well-being → Medical dramas with hope, wellness documentaries
- Relationships & Family → Heartwarming family stories, relationship healing
- Severe Trauma → Gentle recovery stories, therapeutic narratives

**Books:**

- Financial Stress → Financial literacy, success stories, budgeting guides
- Health & Well-being → Wellness guides, mental health memoirs
- Relationships & Family → Relationship advice, family dynamics guides
- Severe Trauma → Healing memoirs, therapeutic self-help books

**Music:**

- Financial Stress → Motivational success songs, perseverance tracks
- Health & Well-being → Healing music, wellness-focused songs
- Relationships & Family → Love and connection songs, family themes
- Severe Trauma → Gentle healing songs, therapeutic music

**Exercises:**

- Financial Stress → Stress-relief yoga, confidence-building strength training
- Health & Well-being → Gentle rehabilitation, wellness-focused yoga
- Relationships & Family → Partner workouts, group fitness classes
- Severe Trauma → Trauma-informed yoga, therapeutic movement

### 3. Response Format Updates

The API now returns enhanced analysis context:

```json
{
  "movies/books/songs/exercises": [...],
  "analysisContext": {
    "totalEntries": 25,
    "totalStressEntries": 8,
    "totalNoStressEntries": 17,
    "stressEntryPercentage": 32.0,
    "nonStressEntryPercentage": 68.0,
    "predictedAspectCounts": {
      "Financial Stress": 3,
      "Health & Well-being": 2,
      "Relationships & Family": 2,
      "Severe Trauma": 1
    },
    "recommendationType": "positive-enhancement",
    "personalizedRecommendations": true
  }
}
```

## Benefits of the Update

1. **More Accurate Analysis**: Uses actual entry counts instead of pre-calculated percentages
2. **Targeted Recommendations**: Considers specific stress aspects for better matching
3. **Personalized Suggestions**: Incorporates both stress patterns and user preferences
4. **Enhanced Context**: Provides comprehensive analysis data in responses
5. **Scalable Architecture**: Easily extensible for new stress aspects and recommendation types

## API Endpoints Affected

All recommendation endpoints now use the new request body format:

- `POST /api/recommendations/movies`
- `POST /api/recommendations/books`
- `POST /api/recommendations/music`
- `POST /api/recommendations/exercises`
- `POST /api/recommendations/combined`

## Example Usage

```javascript
// Example request
const response = await fetch("/api/recommendations/movies", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    totalEntries: 25,
    totalStressEntries: 8,
    totalNoStressEntries: 17,
    predictedAspectCounts: {
      "Financial Stress": 3,
      "Health & Well-being": 2,
      "Relationships & Family": 2,
      "Severe Trauma": 1,
    },
    pastLikings: {
      favoriteMovies: ["Inception", "The Shawshank Redemption"],
    },
  }),
});
```

The system will now generate recommendations that specifically address financial stress, health concerns, relationship issues, and trauma recovery while considering the user's preference for complex, well-crafted films.
