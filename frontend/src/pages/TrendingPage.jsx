import React from 'react'
import { useMovies } from '../context/MovieContext'
import { getTrendingMovies } from '../utils/movieUtils'
import MovieGrid from '../components/movie/MovieGrid'

const TrendingPage = () => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useMovies()
  const trendingMovies = getTrendingMovies(20)

  const handleAddToWatchlist = (movie) => {
    addToWatchlist(movie)
  }

  const handleRemoveFromWatchlist = (movieId) => {
    removeFromWatchlist(movieId)
  }

  const isInWatchlist = (movieId) => {
    return watchlist.some(movie => movie.id === movieId)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">🔥 Trending Movies</h1>
          <p className="text-xl text-gray-300">
            The most popular and highly-rated movies right now
          </p>
        </div>
        
        <MovieGrid
          movies={trendingMovies}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          isInWatchlist={isInWatchlist}
          emptyMessage="No trending movies available"
        />
      </div>
    </div>
  )
}

export default TrendingPage
