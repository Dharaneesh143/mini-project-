import React, { useState, useEffect } from 'react'
import MovieFilters from '../components/movie/MovieFilters'
import MovieGrid from '../components/movie/MovieGrid'
import LoadingSpinner from '../components/common/LoadingSpinner'
import movieService from '../services/movieService'
import { useMovies } from '../context/MovieContext'

const FilteredMoviesPage = () => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useMovies()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const loadMovies = async (newFilters = filters, page = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Loading movies with filters:', newFilters, 'page:', page)
      const response = await movieService.getFilteredMovies(newFilters, page)
      
      if (page === 1) {
        setMovies(response.movies || [])
      } else {
        setMovies(prev => [...prev, ...(response.movies || [])])
      }
      
      setTotalPages(response.totalPages || 1)
      setCurrentPage(page)
    } catch (err) {
      console.error('Error loading filtered movies:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    loadMovies(newFilters, 1)
  }

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      loadMovies(filters, currentPage + 1)
    }
  }

  const isInWatchlist = (movieId) => {
    return watchlist.some(m => (m.id || m.tmdbId) === movieId)
  }

  const toggleWatchlist = (movie) => {
    if (isInWatchlist(movie.id || movie.tmdbId)) {
      removeFromWatchlist(movie.id || movie.tmdbId)
    } else {
      addToWatchlist(movie)
    }
  }

  useEffect(() => {
    loadMovies()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎬 Discover Movies</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Find your perfect movie with advanced filtering options
          </p>
        </div>

        {/* Filters */}
        <MovieFilters 
          onFiltersChange={handleFiltersChange}
          initialFilters={filters}
        />

        {/* Results */}
        <div className="mt-8">
          {loading && movies.length === 0 ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😞</div>
              <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error}
              </p>
              <button
                onClick={() => loadMovies()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold mb-2">No Movies Found</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters to find more movies
              </p>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {movies.length} Movie{movies.length !== 1 ? 's' : ''} Found
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {Object.keys(filters).some(key => filters[key] && filters[key] !== '' && filters[key] !== 'popularity') 
                      ? 'Filtered results' 
                      : 'All movies'
                    }
                  </p>
                </div>
              </div>

              {/* Movies Grid */}
              <MovieGrid 
                movies={movies}
                isInWatchlist={isInWatchlist}
                onToggleWatchlist={toggleWatchlist}
              />

              {/* Load More Button */}
              {currentPage < totalPages && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {loading ? 'Loading...' : 'Load More Movies'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilteredMoviesPage
