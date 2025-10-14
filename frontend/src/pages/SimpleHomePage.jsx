import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroSection from '../components/HeroSection'
import MovieCard from '../components/movie/MovieCard'
import SearchBar from '../components/common/SearchBar'
import { Sparkles, FileQuestion } from 'lucide-react'
import movieService from '../services/movieService'

const SimpleHomePage = () => {
  const [movies, setMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setLoading(true)
        const { movies } = await movieService.getPopularMovies(1)
        setMovies(movies || [])
      } catch (err) {
        setError(err.message)
        console.error("Failed to fetch popular movies:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularMovies()
  }, [])

  return (
    <div className="bg-gray-900 relative">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-4 z-50 flex flex-col items-end space-y-4">
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
          <h2 className="text-2xl font-bold text-white mb-6">New Releases</h2>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movies.map(movie => (
                <MovieCard key={movie.tmdbId} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SimpleHomePage
