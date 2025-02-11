const express = require('express');
const router = express.Router();
const { 
    getMovieRecommendations,
    getBookRecommendations,
    getMusicRecommendations,
    getExerciseRecommendations,
    getCombinedRecommendations 
} = require('../controllers/recommendationController');

// Test endpoint
router.get('/combined', (req, res) => {
  res.json({ message: 'Combined recommendations endpoint hit successfully!' });
});

// Individual routes
router.post('/movies', getMovieRecommendations);
router.post('/books', getBookRecommendations);
router.post('/music', getMusicRecommendations);
router.post('/exercises', getExerciseRecommendations);

// Combined recommendations route
router.post('/combined', getCombinedRecommendations);

module.exports = router; 