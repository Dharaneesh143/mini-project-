import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import MovieCard from '../components/movie/MovieCard'
import MovieGrid from '../components/movie/MovieGrid'
import MovieFilters from '../components/movie/MovieFilters'
import SearchBar from '../components/common/SearchBar'
import { Sparkles, FileQuestion, Bot } from 'lucide-react'
import movieService from '../services/movieService'
import { useMovies } from '../context/MovieContext'

const SimpleHomePage = () => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useMovies()
  const [movies, setMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)

  const loadMovies = async (newFilters = filters) => {
    try {
      setLoading(true)
      setError(null)
      
      let response
      if (Object.keys(newFilters).some(key => newFilters[key] && newFilters[key] !== '' && newFilters[key] !== 'popularity')) {
        // Use filtered movies if filters are applied
        response = await movieService.getFilteredMovies(newFilters, 1)
      } else {
        // Use popular movies if no filters
        response = await movieService.getPopularMovies(1)
      }
      
      setMovies(response.movies || [])
    } catch (err) {
      setError(err.message)
      console.error("Failed to fetch movies:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMovies()
  }, [])

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
    loadMovies(newFilters)
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

  return (
    <div className="bg-gray-900 relative">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-4 z-50 flex flex-col items-end space-y-4">
        <div className="group relative">
          <Link to="/ai-recommendations" className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </Link>
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            AI Chat
          </div>
        </div>
        <div className="group relative">
          <Link to="/recommendations" className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </Link>
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            AI Recommendations
          </div>
        </div>
        <div className="group relative">
          <Link to="/quiz" className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center">
            <FileQuestion className="w-6 h-6" />
          </Link>
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Movie Quiz
          </div>
        </div>
      </div>

      <main>
        <HeroSection />
        {/* On-page Search */}
        <div className="container mx-auto px-4 mt-8">
          <SearchBar
            placeholder="Search movies (all languages)"
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </div>
        <div className="container mx-auto px-4 py-12">
          {/* Header with Filter Toggle */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {Object.keys(filters).some(key => filters[key] && filters[key] !== '' && filters[key] !== 'popularity') 
                ? 'Filtered Movies' 
                : 'New Releases'
              }
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <span>🔍</span>
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-8">
              <MovieFilters 
                onFiltersChange={handleFiltersChange}
                initialFilters={filters}
              />
            </div>
          )}

          {/* Movies */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 bg-red-900/20 p-4 rounded-lg">
              <p>Failed to load movies. Please try again later.</p>
              <p className="text-sm text-red-400 mt-1">Error: {error}</p>
            </div>
          )}
          {!loading && !error && (
            <MovieGrid 
              movies={movies}
              isInWatchlist={isInWatchlist}
              onToggleWatchlist={toggleWatchlist}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default SimpleHomePage
