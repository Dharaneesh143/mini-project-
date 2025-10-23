import React, { useEffect, useState } from 'react'
import movieService from '../services/movieService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import MovieCard from '../components/movie/MovieCard'
import MovieGrid from '../components/movie/MovieGrid'
import { Play, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

const RecommendationsPage = () => {
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [watchlist, setWatchlist] = useState([])

  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist')
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    }
    loadRecommendedMovies()
  }, [])

  const loadRecommendedMovies = async () => {
    try {
      setLoading(true)
      // For demo, use popular movies as AI recommendations
      const response = await movieService.getPopularMovies()
      console.log('Recommendations response:', response)
      setRecommendedMovies(response.movies || [])
    } catch (error) {
      console.error('Error loading recommended movies:', error)
      toast.error('Failed to load recommendations')
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎯 Movie Recommendations</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover amazing movies curated just for you based on popular trends and ratings
          </p>
        </div>

        {recommendedMovies.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-semibold mb-2">No Recommendations Yet</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We're working on finding the perfect movies for you. Check back soon!
            </p>
          </div>
        ) : (
          <MovieGrid 
            movies={recommendedMovies}
            isInWatchlist={isInWatchlist}
            onToggleWatchlist={toggleWatchlist}
          />
        )}
      </div>
    </div>
  )
}

export default RecommendationsPage
