const express = require('express');
const router = express.Router();
const { 
    getMovieRecommendations,
    getBookRecommendations,
    getMusicRecommendations,
    getCombinedRecommendations 
} = require('../controllers/recommendationController');

// Individual routes
router.post('/movies', getMovieRecommendations);
router.post('/books', getBookRecommendations);
router.post('/music', getMusicRecommendations);

// Combined recommendations route
router.post('/combined', getCombinedRecommendations);

module.exports = router; 