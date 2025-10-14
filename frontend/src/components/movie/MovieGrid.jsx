import React from 'react'
import MovieCard from './MovieCard'

const MovieGrid = ({ 
  movies = [], 
  onAddToWatchlist, 
  onRemoveFromWatchlist, 
  isInWatchlist,
  loading = false,
  emptyMessage = "No movies found"
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-700 dark:bg-gray-600 rounded-lg h-96"></div>
          </div>
        ))}
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-xl font-semibold text-gray-400 dark:text-gray-500 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((movie, index) => (
        <div key={movie.id || movie.tmdbId} className={`opacity-0 animate-fade-in-up`} style={{ animationDelay: `${(index % 8) * 60}ms` }}>
          <MovieCard
            movie={movie}
            onAddToWatchlist={onAddToWatchlist}
            onRemoveFromWatchlist={onRemoveFromWatchlist}
            isInWatchlist={isInWatchlist ? isInWatchlist(movie.id || movie.tmdbId) : false}
          />
        </div>
      ))}
    </div>
  )
}

export default MovieGrid
