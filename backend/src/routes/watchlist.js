const express = require('express')
const { body } = require('express-validator')
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlist,
  markAsWatched,
  getWatchedMovies
} = require('../controllers/watchlistController')
const { protect } = require('../middleware/auth')
const { handleValidationErrors } = require('../middleware/validation')

const router = express.Router()

// All routes are protected
router.use(protect)

// Validation rules
const markWatchedValidation = [
  body('rating')
    .optional()
    .isFloat({ min: 1, max: 10 })
    .withMessage('Rating must be between 1 and 10'),
  body('review')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Review cannot be more than 500 characters')
]

// Routes
router.get('/', getWatchlist)
router.get('/watched', getWatchedMovies)
router.get('/:movieId', checkWatchlist)
router.post('/:movieId', addToWatchlist)
router.post('/:movieId/watched', markWatchedValidation, handleValidationErrors, markAsWatched)
router.delete('/:movieId', removeFromWatchlist)

module.exports = router
