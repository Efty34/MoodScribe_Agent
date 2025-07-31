const express = require("express");
const router = express.Router();
const {
  getCombinedRecommendations,
} = require("../controllers/recommendationController");

// Test endpoint
router.get("/combined", (req, res) => {
  res.json({ message: "Combined recommendations endpoint hit successfully!" });
});

// Combined recommendations route
router.post("/combined", getCombinedRecommendations);

module.exports = router;
