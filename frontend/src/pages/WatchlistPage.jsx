import React from 'react'
import { useMovies } from '../context/MovieContext'
import MovieGrid from '../components/movie/MovieGrid'
import EmptyWatchlist from '../components/watchlist/EmptyWatchlist'

const WatchlistPage = () => {
  const { watchlist, removeFromWatchlist } = useMovies()

  const handleRemoveFromWatchlist = (movieId) => {
    removeFromWatchlist(movieId)
  }

  const isInWatchlist = (movieId) => {
    return watchlist.some(movie => movie.id === movieId)
  }

  if (watchlist.length === 0) {
    return <EmptyWatchlist />
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Watchlist</h1>
            <p className="text-gray-400">
              {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved
            </p>
          </div>
        </div>
        
        <MovieGrid
          movies={watchlist}
          onAddToWatchlist={() => {}} // No-op since they're already in watchlist
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          isInWatchlist={isInWatchlist}
          emptyMessage="Your watchlist is empty"
        />
      </div>
    </div>
  )
}

export default WatchlistPage
