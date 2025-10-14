const express = require('express')
const {
  getRecommendations,
  getContentBasedRecommendations,
  getTrendingRecommendations
} = require('../controllers/recommendationController')
const { protect, optionalAuth } = require('../middleware/auth')

const router = express.Router()

// Routes
router.get('/', protect, getRecommendations)
router.get('/content-based', protect, getContentBasedRecommendations)
router.get('/trending', optionalAuth, getTrendingRecommendations)

module.exports = router
