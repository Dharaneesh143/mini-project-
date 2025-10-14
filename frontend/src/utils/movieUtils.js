// Movie utilities for TMDB API integration
import mockMovies from '../data/mockMovies'

// Movie Data Utilities
export const getMovieById = (id) => {
  return mockMovies.find(movie => movie.id === parseInt(id))
}

export const getMoviesByGenre = (genre) => {
  return mockMovies.filter(movie => 
    movie.genre.toLowerCase() === genre.toLowerCase()
  )
}

export const getMoviesByYear = (year) => {
  return mockMovies.filter(movie => movie.year === parseInt(year))
}

export const getMoviesByRating = (minRating) => {
  return mockMovies.filter(movie => movie.rating >= minRating)
}

export const getSimilarMovies = (movieId, limit = 3) => {
  const movie = getMovieById(movieId)
  if (!movie || !movie.similarMovies) return []
  
  return movie.similarMovies
    .map(id => getMovieById(id))
    .filter(Boolean)
    .slice(0, limit)
}

export const searchMovies = (query) => {
  if (!query || query.trim() === '') return []
  
  const lowercaseQuery = query.toLowerCase()
  return mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(lowercaseQuery) ||
    movie.genre.toLowerCase().includes(lowercaseQuery) ||
    movie.director.toLowerCase().includes(lowercaseQuery) ||
    movie.cast.some(actor => actor.toLowerCase().includes(lowercaseQuery)) ||
    movie.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    movie.description.toLowerCase().includes(lowercaseQuery)
  )
}

// Movie Filtering and Sorting
export const filterMovies = (movies, filters) => {
  let filtered = [...movies]
  
  if (filters.genre) {
    filtered = filtered.filter(movie => 
      movie.genre.toLowerCase() === filters.genre.toLowerCase()
    )
  }
  
  if (filters.year) {
    filtered = filtered.filter(movie => movie.year === parseInt(filters.year))
  }
  
  if (filters.minRating) {
    filtered = filtered.filter(movie => movie.rating >= filters.minRating)
  }
  
  if (filters.maxRating) {
    filtered = filtered.filter(movie => movie.rating <= filters.maxRating)
  }
  
  if (filters.director) {
    filtered = filtered.filter(movie => 
      movie.director.toLowerCase().includes(filters.director.toLowerCase())
    )
  }
  
  if (filters.cast) {
    filtered = filtered.filter(movie => 
      movie.cast.some(actor => 
        actor.toLowerCase().includes(filters.cast.toLowerCase())
      )
    )
  }
  
  return filtered
}

export const sortMovies = (movies, sortBy, order = 'desc') => {
  const sorted = [...movies].sort((a, b) => {
    let aVal, bVal
    
    switch (sortBy) {
      case 'title':
        aVal = a.title.toLowerCase()
        bVal = b.title.toLowerCase()
        break
      case 'year':
        aVal = a.year
        bVal = b.year
        break
      case 'rating':
        aVal = a.rating
        bVal = b.rating
        break
      case 'duration':
        aVal = parseInt(a.duration) || 0
        bVal = parseInt(b.duration) || 0
        break
      case 'popularity':
        aVal = a.imdbRating || 0
        bVal = b.imdbRating || 0
        break
      default:
        aVal = a.rating
        bVal = b.rating
    }
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return bVal > aVal ? 1 : -1
    }
  })
  
  return sorted
}

// Additional filtering functions
export const filterMoviesByGenre = (movies, genre) => {
  if (!genre || genre === '') return movies
  return movies.filter(movie => 
    movie.genre.toLowerCase() === genre.toLowerCase()
  )
}

export const sortMoviesByRating = (movies) => {
  return [...movies].sort((a, b) => b.rating - a.rating)
}

export const filterMoviesByRuntime = (movies, minRuntime, maxRuntime) => {
  return movies.filter(movie => {
    const runtime = parseInt(movie.duration) || 0
    return runtime >= minRuntime && runtime <= maxRuntime
  })
}

// Movie Statistics
export const getMovieStats = (movies) => {
  if (!movies || movies.length === 0) {
    return {
      total: 0,
      averageRating: 0,
      genres: {},
      years: {},
      topRated: null,
      mostRecent: null
    }
  }
  
  const total = movies.length
  const averageRating = movies.reduce((sum, movie) => sum + movie.rating, 0) / total
  
  const genres = movies.reduce((acc, movie) => {
    acc[movie.genre] = (acc[movie.genre] || 0) + 1
    return acc
  }, {})
  
  const years = movies.reduce((acc, movie) => {
    acc[movie.year] = (acc[movie.year] || 0) + 1
    return acc
  }, {})
  
  const topRated = movies.reduce((max, movie) => 
    movie.rating > max.rating ? movie : max
  )
  
  const mostRecent = movies.reduce((latest, movie) => 
    movie.year > latest.year ? movie : latest
  )
  
  return {
    total,
    averageRating: Math.round(averageRating * 10) / 10,
    genres,
    years,
    topRated,
    mostRecent
  }
}

// Recommendation Algorithms
export const getContentBasedRecommendations = (userWatchlist, limit = 10) => {
  if (!userWatchlist || userWatchlist.length === 0) {
    return getTrendingMovies(limit)
  }
  
  // Get genres from user's watchlist
  const userGenres = userWatchlist.reduce((acc, movie) => {
    acc[movie.genre] = (acc[movie.genre] || 0) + 1
    return acc
  }, {})
  
  // Calculate genre scores
  const genreScores = Object.entries(userGenres).reduce((acc, [genre, count]) => {
    acc[genre] = count / userWatchlist.length
    return acc
  }, {})
  
  // Score all movies based on user preferences
  const scoredMovies = mockMovies
    .filter(movie => !userWatchlist.some(watched => watched.id === movie.id))
    .map(movie => ({
      ...movie,
      score: genreScores[movie.genre] || 0
    }))
    .filter(movie => movie.score > 0)
    .sort((a, b) => b.score - a.score)
  
  return scoredMovies.slice(0, limit)
}

export const getTrendingMovies = (limit = 10) => {
  return mockMovies
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export const getRecentMovies = (limit = 10) => {
  const currentYear = new Date().getFullYear()
  return mockMovies
    .filter(movie => movie.year >= currentYear - 5)
    .sort((a, b) => b.year - a.year)
    .slice(0, limit)
}

export const getPopularMovies = (limit = 10) => {
  return mockMovies
    .sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0))
    .slice(0, limit)
}

// Movie Comparison
export const compareMovies = (movie1, movie2) => {
  const similarities = []
  const differences = []
  
  if (movie1.genre === movie2.genre) {
    similarities.push('Same genre')
  } else {
    differences.push('Different genres')
  }
  
  if (Math.abs(movie1.year - movie2.year) <= 5) {
    similarities.push('Similar release year')
  } else {
    differences.push('Different release years')
  }
  
  if (Math.abs(movie1.rating - movie2.rating) <= 1) {
    similarities.push('Similar rating')
  } else {
    differences.push('Different ratings')
  }
  
  const commonCast = movie1.cast.filter(actor => 
    movie2.cast.includes(actor)
  )
  
  if (commonCast.length > 0) {
    similarities.push(`Shared cast: ${commonCast.join(', ')}`)
  }
  
  return {
    similarities,
    differences,
    similarityScore: similarities.length / (similarities.length + differences.length)
  }
}

// Movie Validation
export const validateMovie = (movie) => {
  const errors = []
  
  if (!movie.title || movie.title.trim() === '') {
    errors.push('Title is required')
  }
  
  if (!movie.genre || movie.genre.trim() === '') {
    errors.push('Genre is required')
  }
  
  if (!movie.year || movie.year < 1888 || movie.year > new Date().getFullYear() + 5) {
    errors.push('Valid year is required')
  }
  
  if (!movie.rating || movie.rating < 0 || movie.rating > 10) {
    errors.push('Rating must be between 0 and 10')
  }
  
  if (!movie.director || movie.director.trim() === '') {
    errors.push('Director is required')
  }
  
  if (!movie.cast || movie.cast.length === 0) {
    errors.push('At least one cast member is required')
  }
  
  if (!movie.description || movie.description.trim() === '') {
    errors.push('Description is required')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Movie Image Utilities
export const getPosterUrl = (posterPath, size = 'medium') => {
  if (!posterPath) return '/images/no-poster.png'
  
  const sizes = {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    xlarge: 'w780'
  }
  
  return `https://image.tmdb.org/t/p/${sizes[size] || sizes.medium}${posterPath}`
}

export const getBackdropUrl = (backdropPath, size = 'large') => {
  if (!backdropPath) return '/images/hero-bg.jpg'
  
  const sizes = {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    xlarge: 'w1920'
  }
  
  return `https://image.tmdb.org/t/p/${sizes[size] || sizes.large}${backdropPath}`
}

// Movie List Utilities
export const paginateMovies = (movies, page = 1, pageSize = 20) => {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  
  return {
    movies: movies.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(movies.length / pageSize),
      totalItems: movies.length,
      hasNextPage: endIndex < movies.length,
      hasPrevPage: page > 1
    }
  }
}

export const getUniqueGenres = (movies) => {
  const genreSet = new Set(movies.map(movie => movie.genre))
  return Array.from(genreSet).sort()
}

export const getUniqueYears = (movies) => {
  const yearSet = new Set(movies.map(movie => movie.year))
  return Array.from(yearSet).sort((a, b) => b - a)
}
