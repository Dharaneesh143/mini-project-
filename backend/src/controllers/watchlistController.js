const User = require('../models/User')
const Movie = require('../models/Movie')

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchlist', 'title posterPath voteAverage releaseDate genres overview')

    res.json({
      success: true,
      count: user.watchlist.length,
      data: user.watchlist
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Add movie to watchlist
// @route   POST /api/watchlist/:movieId
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params

    // Check if movie exists
    const movie = await Movie.findById(movieId)
    if (!movie || !movie.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      })
    }

    const user = await User.findById(req.user.id)

    // Check if movie is already in watchlist
    if (user.watchlist.includes(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie already in watchlist'
      })
    }

    // Add to watchlist
    user.watchlist.push(movieId)
    await user.save()

    // Populate the added movie
    await user.populate('watchlist', 'title posterPath voteAverage releaseDate genres')

    res.status(201).json({
      success: true,
      message: 'Movie added to watchlist',
      data: user.watchlist
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Remove movie from watchlist
// @route   DELETE /api/watchlist/:movieId
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params

    const user = await User.findById(req.user.id)

    // Check if movie is in watchlist
    if (!user.watchlist.includes(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie not in watchlist'
      })
    }

    // Remove from watchlist
    user.watchlist = user.watchlist.filter(id => id.toString() !== movieId)
    await user.save()

    res.json({
      success: true,
      message: 'Movie removed from watchlist',
      data: user.watchlist
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Check if movie is in watchlist
// @route   GET /api/watchlist/:movieId
// @access  Private
const checkWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params

    const user = await User.findById(req.user.id)
    const isInWatchlist = user.watchlist.includes(movieId)

    res.json({
      success: true,
      data: {
        isInWatchlist,
        movieId
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Mark movie as watched
// @route   POST /api/watchlist/:movieId/watched
// @access  Private
const markAsWatched = async (req, res) => {
  try {
    const { movieId } = req.params
    const { rating, review } = req.body

    // Check if movie exists
    const movie = await Movie.findById(movieId)
    if (!movie || !movie.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      })
    }

    const user = await User.findById(req.user.id)

    // Check if already watched
    const alreadyWatched = user.watchedMovies.find(
      wm => wm.movie.toString() === movieId
    )

    if (alreadyWatched) {
      return res.status(400).json({
        success: false,
        message: 'Movie already marked as watched'
      })
    }

    // Add to watched movies
    user.watchedMovies.push({
      movie: movieId,
      rating: rating || null,
      review: review || null,
      watchedAt: new Date()
    })

    // Remove from watchlist if it's there
    user.watchlist = user.watchlist.filter(id => id.toString() !== movieId)

    await user.save()

    res.status(201).json({
      success: true,
      message: 'Movie marked as watched',
      data: user.watchedMovies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get watched movies
// @route   GET /api/watchlist/watched
// @access  Private
const getWatchedMovies = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchedMovies.movie', 'title posterPath voteAverage releaseDate genres')

    res.json({
      success: true,
      count: user.watchedMovies.length,
      data: user.watchedMovies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkWatchlist,
  markAsWatched,
  getWatchedMovies
}
