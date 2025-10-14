const User = require('../models/User')
const Movie = require('../models/Movie')

// @desc    Get personalized recommendations
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const { limit = 20 } = req.query
    const user = await User.findById(req.user.id)
      .populate('watchlist', 'genres cast director')
      .populate('watchedMovies.movie', 'genres cast director')

    let recommendations = []

    // If user has watchlist or watched movies, use collaborative filtering
    if (user.watchlist.length > 0 || user.watchedMovies.length > 0) {
      recommendations = await getCollaborativeRecommendations(user, parseInt(limit))
    }

    // If not enough recommendations, fill with trending movies
    if (recommendations.length < parseInt(limit)) {
      const trendingMovies = await getTrendingForUser(user, parseInt(limit) - recommendations.length)
      recommendations = [...recommendations, ...trendingMovies]
    }

    // Remove duplicates and movies already in watchlist/watched
    const userMovieIds = [
      ...user.watchlist.map(id => id.toString()),
      ...user.watchedMovies.map(wm => wm.movie.toString())
    ]

    recommendations = recommendations.filter(movie => 
      !userMovieIds.includes(movie._id.toString())
    )

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations.slice(0, parseInt(limit))
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// @desc    Get content-based recommendations
// @route   GET /api/recommendations/content-based
// @access  Private
const getContentBasedRecommendations = async (req, res) => {
  try {
    const { limit = 20 } = req.query
    const user = await User.findById(req.user.id)
      .populate('watchlist', 'genres cast director')
      .populate('watchedMovies.movie', 'genres cast director')

    // Get user's preferred genres
    const userGenres = getUserPreferredGenres(user)
    const userActors = getUserPreferredActors(user)
    const userDirectors = getUserPreferredDirectors(user)

    // Build query based on user preferences
    const query = {
      isActive: true,
      _id: { $nin: [
        ...user.watchlist,
        ...user.watchedMovies.map(wm => wm.movie)
      ]}
    }

    // Add genre filter if user has preferences
    if (userGenres.length > 0) {
      query.genres = { $in: userGenres }
    }

    // Get recommendations
    let recommendations = await Movie.find(query)
      .sort({ voteAverage: -1, popularity: -1 })
      .limit(parseInt(limit) * 2) // Get more to filter later

    // Score and sort by relevance
    recommendations = scoreMovies(recommendations, userGenres, userActors, userDirectors)
      .sort((a, b) => b.score - a.score)
      .slice(0, parseInt(limit))

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

// @desc    Get trending recommendations
// @route   GET /api/recommendations/trending
// @access  Public
const getTrendingRecommendations = async (req, res) => {
  try {
    const { limit = 20 } = req.query

    const movies = await Movie.find({ isActive: true })
      .sort({ popularity: -1, voteAverage: -1 })
      .limit(parseInt(limit))
      .select('title posterPath voteAverage releaseDate genres overview')

    res.json({
      success: true,
      count: movies.length,
      data: movies
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

// Helper functions
const getCollaborativeRecommendations = async (user, limit) => {
  const userGenres = getUserPreferredGenres(user)
  const userActors = getUserPreferredActors(user)
  const userDirectors = getUserPreferredDirectors(user)

  const query = {
    isActive: true,
    _id: { $nin: [
      ...user.watchlist,
      ...user.watchedMovies.map(wm => wm.movie)
    ]}
  }

  // Add genre filter
  if (userGenres.length > 0) {
    query.genres = { $in: userGenres }
  }

  let movies = await Movie.find(query)
    .sort({ voteAverage: -1, popularity: -1 })
    .limit(limit * 2)

  // Score movies based on user preferences
  movies = scoreMovies(movies, userGenres, userActors, userDirectors)
    .sort((a, b) => b.score - a.score)

  return movies.slice(0, limit)
}

const getTrendingForUser = async (user, limit) => {
  const userMovieIds = [
    ...user.watchlist.map(id => id.toString()),
    ...user.watchedMovies.map(wm => wm.movie.toString())
  ]

  return await Movie.find({
    isActive: true,
    _id: { $nin: userMovieIds }
  })
  .sort({ popularity: -1, voteAverage: -1 })
  .limit(limit)
  .select('title posterPath voteAverage releaseDate genres overview')
}

const getUserPreferredGenres = (user) => {
  const genreCount = {}
  
  // Count genres from watchlist
  user.watchlist.forEach(movie => {
    movie.genres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1
    })
  })

  // Count genres from watched movies
  user.watchedMovies.forEach(wm => {
    wm.movie.genres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1
    })
  })

  // Return top genres
  return Object.entries(genreCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([genre]) => genre)
}

const getUserPreferredActors = (user) => {
  const actorCount = {}
  
  user.watchlist.forEach(movie => {
    movie.cast.forEach(actor => {
      actorCount[actor.name] = (actorCount[actor.name] || 0) + 1
    })
  })

  user.watchedMovies.forEach(wm => {
    wm.movie.cast.forEach(actor => {
      actorCount[actor.name] = (actorCount[actor.name] || 0) + 1
    })
  })

  return Object.entries(actorCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([actor]) => actor)
}

const getUserPreferredDirectors = (user) => {
  const directorCount = {}
  
  user.watchlist.forEach(movie => {
    if (movie.director) {
      directorCount[movie.director] = (directorCount[movie.director] || 0) + 1
    }
  })

  user.watchedMovies.forEach(wm => {
    if (wm.movie.director) {
      directorCount[wm.movie.director] = (directorCount[wm.movie.director] || 0) + 1
    }
  })

  return Object.entries(directorCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([director]) => director)
}

const scoreMovies = (movies, userGenres, userActors, userDirectors) => {
  return movies.map(movie => {
    let score = 0

    // Genre matching
    const matchingGenres = movie.genres.filter(genre => userGenres.includes(genre))
    score += matchingGenres.length * 2

    // Actor matching
    const matchingActors = movie.cast.filter(actor => userActors.includes(actor.name))
    score += matchingActors.length * 1.5

    // Director matching
    if (userDirectors.includes(movie.director)) {
      score += 3
    }

    // Rating bonus
    score += movie.voteAverage * 0.5

    // Popularity bonus
    score += movie.popularity * 0.1

    return { ...movie.toObject(), score }
  })
}

module.exports = {
  getRecommendations,
  getContentBasedRecommendations,
  getTrendingRecommendations
}
