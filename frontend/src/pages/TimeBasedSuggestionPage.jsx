import React, { useEffect, useState } from 'react'
import movieService from '../services/movieService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Play, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

const TimeBasedSuggestionPage = () => {
  const [suggestedMovies, setSuggestedMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [watchlist, setWatchlist] = useState([])

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist')
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    }
    loadSuggestedMovies()
  }, [])

  const loadSuggestedMovies = async () => {
    try {
      setLoading(true)
      const now = new Date()
      const day = now.getDay()
      const hour = now.getHours()
      let movies = []

      if (day === 0 || day === 6 || hour >= 18) {
        // Weekend or evening: suggest popular movies (epic adventures)
        const response = await movieService.getPopularMovies()
        movies = response.movies
      } else {
        // Weekday daytime: suggest quick watch movies (under 2 hours)
        const response = await movieService.getAllMovies()
        movies = response.movies.filter(m => m.duration && m.duration <= 120)
      }
      setSuggestedMovies(movies.slice(0, 20))
    } catch (error) {
      console.error('Error loading time-based suggestions:', error)
      toast.error('Failed to load suggestions')
    } finally {
      setLoading(false)
    }
  }

  const addToWatchlist = (movie) => {
    const newWatchlist = [...watchlist, movie]
    setWatchlist(newWatchlist)
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist))
    toast.success('Added to watchlist!')
  }

  const removeFromWatchlist = (movieId) => {
    const newWatchlist = watchlist.filter(m => m.id !== movieId)
    setWatchlist(newWatchlist)
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist))
    toast.success('Removed from watchlist')
  }

  const isInWatchlist = (movieId) => {
    return watchlist.some(m => m.id === movieId)
  }

  const toggleWatchlist = (movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Time-Based Movie Suggestions</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {suggestedMovies.map(movie => (
          <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform cursor-pointer">
            <div className="aspect-[2/3] bg-gray-700 flex items-center justify-center">
              <Play className="w-12 h-12 text-gray-400" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-white mb-1 truncate">{movie.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                <span>Rating: {movie.rating || 'N/A'}</span>
                <span>•</span>
                <span>Year: {movie.year || 'N/A'}</span>
              </div>
              <button
                onClick={() => toggleWatchlist(movie)}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isInWatchlist(movie.id) ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                {isInWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TimeBasedSuggestionPage
