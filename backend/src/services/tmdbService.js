const axios = require('axios')

class TMDBService {
  constructor() {
    this.baseURL = 'https://api.themoviedb.org/3'
    this.apiKey = 'ecfa837bb91bbbca17970e60da354c6b'
    this.imageBaseURL = 'https://image.tmdb.org/t/p'
    
    if (!this.apiKey) {
      console.warn('TMDB API key not found. Some features may not work.')
    }
  }

  // Create axios instance with default config
  createAxiosInstance() {
    return axios.create({
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey
      },
      timeout: 30000
    })
  }

  // Get all movies (discover) without language or genre filters
  async getAllMovies(page = 1) {
    try {
      const api = this.createAxiosInstance()
      const response = await api.get('/discover/movie', {
        params: {
          page,
          sort_by: 'popularity.desc'
        }
      })
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error fetching all movies:', error.message)
      // Return fallback data when TMDB is not available
      return this.getFallbackMovies(page)
    }
  }

  // Get popular movies
  async getPopularMovies(page = 1) {
    try {
      const api = this.createAxiosInstance()
      const response = await api.get('/movie/popular', {
        params: { page }
      })
      // Fetch full details for each movie to get genres, cast, etc.
      const detailedMovies = await Promise.all(
        response.data.results.map(movie => this.getMovieDetails(movie.id))
      )
      response.data.results = detailedMovies
      // We are now returning full movie objects, so we can just format them
      // without the full response wrapper.
      return this.formatMoviesResponse(response.data, true)
    } catch (error) {
      console.error('Error fetching popular movies:', error.message)
      // Return fallback data when TMDB is not available
      return this.getFallbackMovies(page)
    }
  }

  // Get trending movies
  async getTrendingMovies(timeWindow = 'week', page = 1) {
    try {
      const api = this.createAxiosInstance()
      const response = await api.get(`/trending/movie/${timeWindow}`, {
        params: { page }
      })
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error fetching trending movies:', error.message)
      // Return fallback data when TMDB is not available
      return this.getFallbackMovies(page)
    }
  }

  // Get upcoming movies
  async getUpcomingMovies(page = 1) {
    try {
      const api = this.createAxiosInstance()
      const response = await api.get('/movie/upcoming', {
        params: { page }
      })
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error fetching upcoming movies:', error.message)
      // Return fallback data when TMDB is not available
      return this.getFallbackMovies(page)
    }
  }

  // Get now playing movies
  async getNowPlayingMovies(page = 1) {
    try {
      const api = this.createAxiosInstance()
      const response = await api.get('/movie/now_playing', {
        params: { page }
      })
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error fetching now playing movies:', error.message)
      // Return fallback data when TMDB is not available
      return this.getFallbackMovies(page)
    }
  }

  // Search movies
  async searchMovies(query, page = 1) {
    try {
      const api = this.createAxiosInstance()
      const response = await api.get('/search/movie', {
        params: {
          query,
          page,
          include_adult: true // Include adult movies in search
        }
      })
      // Fetch full details for each movie to get genres, cast, etc.
      const detailedMovies = await Promise.all(
        response.data.results.map(movie => this.getMovieDetails(movie.id))
      )
      response.data.results = detailedMovies
      return this.formatMoviesResponse(response.data, true)
    } catch (error) {
      console.error('Error searching movies:', error.message)
      // Return fallback data when TMDB is not available
      return this.getFallbackMovies(page)
    }
  }



  // Get movie details
  async getMovieDetails(movieId) {
    try {
      const api = this.createAxiosInstance()
      const [movieResponse, creditsResponse, imagesResponse, keywordsResponse] = await Promise.all([
        api.get(`/movie/${movieId}`),
        api.get(`/movie/${movieId}/credits`),
        api.get(`/movie/${movieId}/images`),
        api.get(`/movie/${movieId}/keywords`)
      ])

      return this.formatMovieDetails(movieResponse.data, creditsResponse.data, imagesResponse.data, keywordsResponse.data)
    } catch (error) {
      console.error('Error fetching movie details:', error.message)
      throw new Error('Failed to fetch movie details from TMDB')
    }
  }

  // Get movies by genre
  async getMoviesByGenre(genreId, page = 1) {
    try {
      const api = this.createAxiosInstance()
      const response = await api.get('/discover/movie', {
        params: { 
          with_genres: genreId,
          page,
          sort_by: 'popularity.desc'
        }
      })
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error fetching movies by genre:', error.message)
      throw new Error('Failed to fetch movies by genre from TMDB')
    }
  }

  // Get similar movies
  async getSimilarMovies(movieId, page = 1) {
    try {
      const api = this.createAxiosInstance()
      const response = await api.get(`/movie/${movieId}/similar`, {
        params: { page }
      })
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error fetching similar movies:', error.message)
      throw new Error('Failed to fetch similar movies from TMDB')
    }
  }

  // Get movie recommendations
  async getMovieRecommendations(movieId, page = 1) {
    try {
      const api = this.createAxiosInstance()
      const response = await api.get(`/movie/${movieId}/recommendations`, {
        params: { page }
      })
      return this.formatMoviesResponse(response.data)
    } catch (error) {
      console.error('Error fetching movie recommendations:', error.message)
      throw new Error('Failed to fetch movie recommendations from TMDB')
    }
  }

  // Get genres list
  async getGenres() {
    try {
      const api = this.createAxiosInstance()
      const response = await api.get('/genre/movie/list')
      return response.data.genres
    } catch (error) {
      console.error('Error fetching genres:', error.message)
      throw new Error('Failed to fetch genres from TMDB')
    }
  }

  // Format movies response
  formatMoviesResponse(data, isDetailed = false) {
    const movies = isDetailed
      ? data.results // Already detailed objects
      : data.results.map(movie => this.formatMovie(movie))

    return {
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      movies: movies
    }
  }

  // Format single movie
  formatMovie(movie) {
    return {
      tmdbId: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      description: movie.overview, // Use 'description' to match MovieCard
      releaseDate: movie.release_date ? new Date(movie.release_date) : null,
      adult: movie.adult,
      originalLanguage: movie.original_language,
      popularity: movie.popularity,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      posterPath: movie.poster_path ? `${this.imageBaseURL}/w500${movie.poster_path}` : null,
      posterUrl: movie.poster_path ? `${this.imageBaseURL}/w500${movie.poster_path}` : null, // Add posterUrl
      genreIds: movie.genre_ids || []
    }
  }

  // Format detailed movie
  formatMovieDetails(movie, credits, images, keywords) {
    const director = credits.crew.find(person => person.job === 'Director')
    const writers = credits.crew.filter(person => person.job === 'Writer' || person.job === 'Screenplay')
    const producers = credits.crew.filter(person => person.job === 'Producer')

    return {
      tmdbId: movie.id,
      title: movie.title,
      originalTitle: movie.original_title,
      description: movie.overview, // Use 'description' to match MovieCard
      tagline: movie.tagline,
      genres: movie.genres.map(genre => genre.name),
      releaseDate: movie.release_date ? new Date(movie.release_date) : null,
      runtime: movie.runtime,
      adult: movie.adult,
      originalLanguage: movie.original_language,
      spokenLanguages: movie.spoken_languages.map(lang => lang.english_name),
      productionCountries: movie.production_countries.map(country => country.name),
      budget: movie.budget,
      revenue: movie.revenue,
      popularity: movie.popularity,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
      posterPath: movie.poster_path ? `${this.imageBaseURL}/w500${movie.poster_path}` : null,
      posterUrl: movie.poster_path ? `${this.imageBaseURL}/w500${movie.poster_path}` : null, // Add posterUrl
      backdropPath: movie.backdrop_path ? `${this.imageBaseURL}/w1280${movie.backdrop_path}` : null,
      images: {
        posters: images.posters.slice(0, 10).map(img => `${this.imageBaseURL}/w500${img.file_path}`),
        backdrops: images.backdrops.slice(0, 10).map(img => `${this.imageBaseURL}/w1280${img.file_path}`)
      },
      cast: credits.cast.slice(0, 10).map(person => ({
        id: person.id,
        name: person.name,
        character: person.character,
        order: person.order,
        profilePath: person.profile_path ? `${this.imageBaseURL}/w185${person.profile_path}` : null
      })), // Ensure cast is an array of objects
      crew: credits.crew.slice(0, 20).map(person => ({
        id: person.id,
        name: person.name,
        job: person.job,
        department: person.department,
        profilePath: person.profile_path ? `${this.imageBaseURL}/w185${person.profile_path}` : null
      })),
      director: director ? director.name : null,
      writers: writers.map(writer => writer.name),
      producers: producers.map(producer => producer.name),
      keywords: keywords.keywords.map(k => k.name),
      status: movie.status,
      isActive: true
    }
  }

  // Get full image URL
  getImageURL(path, size = 'w500') {
    if (!path) return null
    return `${this.imageBaseURL}/${size}${path}`
  }

  // Fallback method when TMDB API is not available
  getFallbackMovies(page = 1) {
    const fallbackMovies = [
      {
        tmdbId: 550,
        title: "Fight Club",
        originalTitle: "Fight Club",
        overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
        releaseDate: new Date("1999-10-15"),
        adult: false,
        originalLanguage: "en",
        popularity: 85.5,
        voteAverage: 8.8,
        voteCount: 26280,
        posterPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=500&h=750&fit=crop",
        backdropPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=1280&h=720&fit=crop",
        genreIds: [18, 53]
      },
      {
        tmdbId: 155,
        title: "The Dark Knight",
        originalTitle: "The Dark Knight",
        overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
        releaseDate: new Date("2008-07-18"),
        adult: false,
        originalLanguage: "en",
        popularity: 90.2,
        voteAverage: 9.0,
        voteCount: 31000,
        posterPath: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=750&fit=crop",
        backdropPath: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1280&h=720&fit=crop",
        genreIds: [28, 80, 18]
      },
      {
        tmdbId: 27205,
        title: "Inception",
        originalTitle: "Inception",
        overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
        releaseDate: new Date("2010-07-16"),
        adult: false,
        originalLanguage: "en",
        popularity: 88.7,
        voteAverage: 8.8,
        voteCount: 34000,
        posterPath: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&h=750&fit=crop",
        backdropPath: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1280&h=720&fit=crop",
        genreIds: [28, 878, 53]
      },
      {
        tmdbId: 13,
        title: "Forrest Gump",
        originalTitle: "Forrest Gump",
        overview: "The presidencies of Kennedy and Johnson through the eyes of an Alabama man with an IQ of 75.",
        releaseDate: new Date("1994-07-06"),
        adult: false,
        originalLanguage: "en",
        popularity: 82.1,
        voteAverage: 8.8,
        voteCount: 25000,
        posterPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=500&h=750&fit=crop",
        backdropPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=1280&h=720&fit=crop",
        genreIds: [35, 18, 10749]
      },
      {
        tmdbId: 680,
        title: "Pulp Fiction",
        originalTitle: "Pulp Fiction",
        overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
        releaseDate: new Date("1994-10-14"),
        adult: false,
        originalLanguage: "en",
        popularity: 87.3,
        voteAverage: 8.9,
        voteCount: 27000,
        posterPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=500&h=750&fit=crop",
        backdropPath: "https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=1280&h=720&fit=crop",
        genreIds: [80, 18]
      }
    ]

    const itemsPerPage = 20
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedMovies = fallbackMovies.slice(startIndex, endIndex)

    return {
      page: page,
      totalPages: Math.ceil(fallbackMovies.length / itemsPerPage),
      totalResults: fallbackMovies.length,
      movies: paginatedMovies
    }
  }
}

module.exports = new TMDBService()
