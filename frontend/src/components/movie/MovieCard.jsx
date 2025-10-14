import React from 'react'
import { Link } from 'react-router-dom'
import { formatRating } from '../../utils/helpers'

const MovieCard = ({ 
  movie, 
  onAddToWatchlist, 
  onRemoveFromWatchlist, 
  isInWatchlist = false,
  showActions = true 
}) => {
  const handleWatchlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInWatchlist) {
      onRemoveFromWatchlist(movie.id)
    } else {
      onAddToWatchlist(movie)
    }
  }

  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-scale-in">
        {/* Movie Poster */}
        <div className="relative">
          <img
            src={movie.poster || 'https://via.placeholder.com/300x450/374151/9ca3af?text=No+Poster+Available'}
            alt={movie.title}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
            ⭐ {formatRating(movie.rating)}
          </div>
          
          {/* Watchlist Button */}
          {showActions && (
            <button
              onClick={handleWatchlistToggle}
              className={`absolute top-2 left-2 p-2 rounded-full transition-colors ${
                isInWatchlist 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'
              }`}
              title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {isInWatchlist ? '❤️' : '🤍'}
            </button>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white bg-opacity-90 text-gray-900 px-4 py-2 rounded-lg font-semibold">
                View Details
              </div>
            </div>
          </div>
        </div>
        
        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>{movie.genre}</span>
            <span>{movie.year}</span>
          </div>
          
          <p className="text-gray-300 text-sm line-clamp-3 mb-3">
            {movie.description}
          </p>
          
          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{movie.duration || 'N/A'}</span>
            <span>{movie.originalLanguage ? movie.originalLanguage.toUpperCase() : 'N/A'}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
