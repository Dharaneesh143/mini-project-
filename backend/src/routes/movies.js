const express = require('express')
const {
  getMovies,
  getMovie,
  getTrendingMovies,
  getMoviesByGenre,
  getSimilarMovies,
  getMovieRecommendations,
  searchMovies,
  getGenres,
  getPopularMovies,
  searchTMDBMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getTMDBMovieDetails,
  getAllMovies
} = require('../controllers/movieController')
const { optionalAuth } = require('../middleware/auth')

const router = express.Router()

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Movies API is working',
    timestamp: new Date().toISOString()
  })
})

// Routes
router.get('/', optionalAuth, getMovies)
router.get('/trending', getTrendingMovies)
router.get('/popular', getPopularMovies)
router.get('/upcoming', getUpcomingMovies)
router.get('/now-playing', getNowPlayingMovies)
router.get('/tmdb/search', searchTMDBMovies)
router.get('/tmdb/:id', getTMDBMovieDetails)
router.get('/genres', getGenres)
router.get('/search', searchMovies)
router.get('/genre/:genre', getMoviesByGenre)
router.get('/all', getAllMovies)
router.get('/:id', getMovie)
router.get('/:id/similar', getSimilarMovies)
router.get('/:id/recommendations', getMovieRecommendations)

module.exports = router
