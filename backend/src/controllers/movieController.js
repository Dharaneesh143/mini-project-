const Movie = require('../models/Movie')
const tmdbService = require('../services/tmdbService')

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query
    const tmdbData = await tmdbService.getAllMovies(page)

    res.json({
      success: true,
      count: tmdbData.movies.length,
      page: tmdbData.page,
      totalPages: tmdbData.totalPages,
      totalResults: tmdbData.totalResults,
      data: tmdbData.movies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get all movies from TMDB (all languages and genres)
// @route   GET /api/movies/all
// @access  Public
const getAllMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query
    const tmdbData = await tmdbService.getAllMovies(page)

    res.json({
      success: true,
      count: tmdbData.movies.length,
      page: tmdbData.page,
      totalPages: tmdbData.totalPages,
      totalResults: tmdbData.totalResults,
      data: tmdbData.movies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
const getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('similarMovies', 'title posterPath voteAverage releaseDate genres')
      .populate('recommendations', 'title posterPath voteAverage releaseDate genres')

    if (!movie || !movie.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      })
    }

    res.json({
      success: true,
      data: movie
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get trending movies
// @route   GET /api/movies/trending
// @access  Public
const getTrendingMovies = async (req, res) => {
  try {
    const { page = 1, source = 'tmdb' } = req.query

    if (source === 'tmdb') {
      // Fetch from TMDB API
      const tmdbData = await tmdbService.getTrendingMovies('week', page)
      
      res.json({
        success: true,
        count: tmdbData.movies.length,
        page: tmdbData.page,
        totalPages: tmdbData.totalPages,
        totalResults: tmdbData.totalResults,
        data: tmdbData.movies
      })
    } else {
      // Fetch from local database
      const { limit = 20 } = req.query
      const movies = await Movie.find({ isActive: true })
        .sort({ popularity: -1, voteAverage: -1 })
        .limit(parseInt(limit))
        .select('title posterPath voteAverage releaseDate genres popularity')

      res.json({
        success: true,
        count: movies.length,
        data: movies
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get movies by genre
// @route   GET /api/movies/genre/:genre
// @access  Public
const getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params
    const { page = 1 } = req.query

    // Use TMDB discover endpoint with genre filter
    const tmdbData = await tmdbService.getMoviesByGenre(genre, page)

    res.json({
      success: true,
      count: tmdbData.movies.length,
      page: tmdbData.page,
      totalPages: tmdbData.totalPages,
      totalResults: tmdbData.totalResults,
      data: tmdbData.movies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get similar movies
// @route   GET /api/movies/:id/similar
// @access  Public
const getSimilarMovies = async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const similarMovies = await tmdbService.getSimilarMovies(req.params.id, 1) // Get first page
    const limitedMovies = similarMovies.movies.slice(0, parseInt(limit))

    res.json({
      success: true,
      count: limitedMovies.length,
      data: limitedMovies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get movie recommendations
// @route   GET /api/movies/:id/recommendations
// @access  Public
const getMovieRecommendations = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
    
    if (!movie || !movie.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      })
    }

    const recommendations = await movie.getRecommendations(10)

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Search movies
// @route   GET /api/movies/search
// @access  Public
const searchMovies = async (req, res) => {
  try {
    const { q, page = 1 } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      })
    }

    const tmdbData = await tmdbService.searchMovies(q, page)

    res.json({
      success: true,
      count: tmdbData.movies.length,
      page: tmdbData.page,
      totalPages: tmdbData.totalPages,
      totalResults: tmdbData.totalResults,
      data: tmdbData.movies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get available genres
// @route   GET /api/movies/genres
// @access  Public
const getGenres = async (req, res) => {
  try {
    const genres = await tmdbService.getGenres()
    
    res.json({
      success: true,
      count: genres.length,
      data: genres
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get popular movies from TMDB
// @route   GET /api/movies/popular
// @access  Public
const getPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query

    console.log('Fetching popular movies from TMDB...')
    const tmdbData = await tmdbService.getPopularMovies(page)
    
    res.json({
      success: true,
      count: tmdbData.movies.length,
      page: tmdbData.page,
      totalPages: tmdbData.totalPages,
      totalResults: tmdbData.totalResults,
      data: tmdbData.movies || []
    })
  } catch (error) {
    console.error('Popular movies error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Search movies from TMDB
// @route   GET /api/movies/tmdb/search
// @access  Public
const searchTMDBMovies = async (req, res) => {
  try {
    const { q, page = 1 } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      })
    }

    const tmdbData = await tmdbService.searchMovies(q, page)
    
    res.json({
      success: true,
      count: tmdbData.movies.length,
      page: tmdbData.page,
      totalPages: tmdbData.totalPages,
      totalResults: tmdbData.totalResults,
      data: tmdbData.movies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get upcoming movies from TMDB
// @route   GET /api/movies/upcoming
// @access  Public
const getUpcomingMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query
    const tmdbData = await tmdbService.getUpcomingMovies(page)

    res.json({
      success: true,
      count: tmdbData.movies.length,
      page: tmdbData.page,
      totalPages: tmdbData.totalPages,
      totalResults: tmdbData.totalResults,
      data: tmdbData.movies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get now playing movies from TMDB
// @route   GET /api/movies/now-playing
// @access  Public
const getNowPlayingMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query
    const tmdbData = await tmdbService.getNowPlayingMovies(page)

    res.json({
      success: true,
      count: tmdbData.movies.length,
      page: tmdbData.page,
      totalPages: tmdbData.totalPages,
      totalResults: tmdbData.totalResults,
      data: tmdbData.movies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get movie details from TMDB
// @route   GET /api/movies/tmdb/:id
// @access  Public
const getTMDBMovieDetails = async (req, res) => {
  try {
    const { id } = req.params
    const movieDetails = await tmdbService.getMovieDetails(id)
    
    res.json({
      success: true,
      data: movieDetails
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
}
