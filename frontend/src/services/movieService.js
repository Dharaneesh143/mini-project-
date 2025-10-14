import axios from 'axios'
import {
  hasTmdbKey,
  tmdbPopular,
  tmdbTrending,
  tmdbUpcoming,
  tmdbSearch,
  tmdbDetails,
  tmdbSimilar,
  mapTmdbToMovie,
  mapTmdbToDetails,
} from './tmdbClient'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class MovieService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000
    })

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error)
        throw error
      }
    )
  }

  // Get popular movies
  async getPopularMovies(page = 1) {
    try {
      const response = await this.api.get('/movies/popular', { params: { page } })
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error fetching popular movies:', error)
      // Fallback to TMDB if backend fails and TMDB key is available
      if (hasTmdbKey()) {
        try {
          const data = await tmdbPopular(page)
          const movies = data.results.map(mapTmdbToMovie)
          return { movies, totalPages: data.total_pages, totalResults: data.total_results, page: data.page }
        } catch (tmdbError) {
          console.error('TMDB fallback also failed:', tmdbError)
          throw error // Throw original error
        }
      }
      throw error
    }
  }

  // Get all movies (all languages and genres)
  async getAllMovies(page = 1) {
    try {
      const response = await this.api.get('/movies/all', { params: { page } })
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error fetching all movies:', error)
      // Fallback to TMDB if backend fails and TMDB key is available
      if (hasTmdbKey()) {
        try {
          const data = await tmdbTrending(page)
          const movies = data.results.map(mapTmdbToMovie)
          return { movies, totalPages: data.total_pages, totalResults: data.total_results, page: data.page }
        } catch (tmdbError) {
          console.error('TMDB fallback also failed:', tmdbError)
          throw error // Throw original error
        }
      }
      throw error
    }
  }

  // Get trending movies
  async getTrendingMovies(page = 1) {
    try {
      const response = await this.api.get('/movies/trending', { params: { page } })
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error fetching trending movies:', error)
      // Fallback to TMDB if backend fails and TMDB key is available
      if (hasTmdbKey()) {
        try {
          const data = await tmdbTrending(page)
          const movies = data.results.map(mapTmdbToMovie)
          return { movies, totalPages: data.total_pages, totalResults: data.total_results, page: data.page }
        } catch (tmdbError) {
          console.error('TMDB fallback also failed:', tmdbError)
          throw error // Throw original error
        }
      }
      throw error
    }
  }

  // Get upcoming movies
  async getUpcomingMovies(page = 1) {
    try {
      const response = await this.api.get('/movies/upcoming', { params: { page } })
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error fetching upcoming movies:', error)
      // Fallback to TMDB if backend fails and TMDB key is available
      if (hasTmdbKey()) {
        try {
          const data = await tmdbUpcoming(page)
          const movies = data.results.map(mapTmdbToMovie)
          return { movies, totalPages: data.total_pages, totalResults: data.total_results, page: data.page }
        } catch (tmdbError) {
          console.error('TMDB fallback also failed:', tmdbError)
          throw error // Throw original error
        }
      }
      throw error
    }
  }

  // Search movies
  async searchMovies(query, page = 1) {
    try {
      console.log('Searching movies with query:', query, 'page:', page)
      const response = await this.api.get('/movies/search', { params: { q: query, page, limit: 20 } })
      console.log('Search response:', response.data)
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error searching movies:', error)
      // Fallback to TMDB if backend fails and TMDB key is available
      if (hasTmdbKey()) {
        try {
          console.log('Falling back to TMDB search')
          const data = await tmdbSearch(query, page, false)
          const movies = data.results.map(mapTmdbToMovie)
          return { movies, totalPages: data.total_pages, totalResults: data.total_results, page: data.page }
        } catch (tmdbError) {
          console.error('TMDB fallback also failed:', tmdbError)
          throw error // Throw original error
        }
      }
      throw error
    }
  }

  // Get movies by genre
  async getMoviesByGenre(genre, page = 1) {
    try {
      if (hasTmdbKey()) {
        // Fallback to search by genre name when using TMDB without genre mapping
        const data = await tmdbSearch(genre, page, false)
        const movies = data.results.map(mapTmdbToMovie)
        return { movies, totalPages: data.total_pages, totalResults: data.total_results, page: data.page }
      }
      const response = await this.api.get(`/movies/genre/${genre}`, { params: { page, limit: 20 } })
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error fetching movies by genre:', error)
      throw error
    }
  }

  // Get genres
  async getGenres() {
    try {
      const response = await this.api.get('/movies/genres')
      return response.data.data || []
    } catch (error) {
      console.error('Error fetching genres:', error)
      return []
    }
  }

  // Format movies response to match component expectations
  formatMoviesResponse(data) {
    if (!data.success || !data.data) {
      return { movies: [], totalPages: 0, totalResults: 0 }
    }

    const movies = data.data.map(movie => this.formatMovie(movie))
    return {
      movies,
      totalPages: data.totalPages || Math.ceil((data.total || data.totalResults || 0) / 20),
      totalResults: data.total || data.totalResults || 0,
      page: data.page || 1
    }
  }

  // Get movie details
  async getMovieDetails(id) {
    try {
      if (hasTmdbKey()) {
        const data = await tmdbDetails(id)
        return mapTmdbToDetails(data)
      }
      const response = await this.api.get(`/movies/tmdb/${id}`)
      return this.formatMovieDetails(response.data.data)
    } catch (error) {
      console.error('Error fetching movie details:', error)
      throw error
    }
  }

  // Get similar movies
  async getSimilarMovies(id, limit = 4) {
    try {
      if (hasTmdbKey()) {
        const data = await tmdbSimilar(id, 1)
        const movies = (data.results || []).slice(0, limit).map(mapTmdbToMovie)
        return { movies }
      }
      const response = await this.api.get(`/movies/${id}/similar`, { params: { limit } })
      return { movies: response.data.data || [] }
    } catch (error) {
      console.error('Error fetching similar movies:', error)
      throw error
    }
  }

  // Format single movie to match component expectations
  formatMovie(movie) {
    return {
      id: movie.tmdbId || movie._id || movie.id,
      title: movie.title,
      poster: movie.posterPath || movie.poster,
      backdrop: movie.backdropPath || movie.backdrop,
      rating: movie.voteAverage || movie.rating,
      release_date: movie.releaseDate || movie.release_date,
      year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : (movie.release_date ? new Date(movie.release_date).getFullYear() : null),
      genre: Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres || '',
      genres: movie.genres || [],
      runtime: movie.runtime || 0,
      duration: movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '',
      description: movie.overview || movie.description || '',
      views: movie.popularity ? Math.floor(movie.popularity * 10000) : 0, // Estimate views from popularity
      popularity: movie.popularity || 0,
      originalLanguage: movie.originalLanguage || movie.original_language,
      spokenLanguages: movie.spokenLanguages || movie.spoken_languages
    }
  }

  // Format detailed movie to match component expectations
  formatMovieDetails(movie) {
    return {
      id: movie.tmdbId || movie.id,
      title: movie.title,
      posterPath: movie.posterPath || movie.poster,
      backdropPath: movie.backdropPath || movie.backdrop,
      voteAverage: movie.voteAverage || movie.rating,
      releaseDate: movie.releaseDate,
      year: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null,
      genres: movie.genres || [],
      runtime: movie.runtime,
      overview: movie.description || movie.overview,
      director: movie.director,
      cast: movie.cast || [],
      writers: movie.writers || [],
      producers: movie.producers || [],
      budget: movie.budget,
      revenue: movie.revenue,
      originalLanguage: movie.originalLanguage,
      spokenLanguages: movie.spokenLanguages || [],
      productionCountries: movie.productionCountries || [],
      popularity: movie.popularity,
      voteCount: movie.voteCount,
      tagline: movie.tagline,
      status: movie.status,
      isActive: movie.isActive,
      keywords: movie.keywords || []
    }
  }
}

export default new MovieService()
