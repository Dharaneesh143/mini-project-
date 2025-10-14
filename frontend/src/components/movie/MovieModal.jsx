import React from 'react'
import { X, Star, Clock, Calendar, Play } from 'lucide-react'

const MovieModal = ({ movie, isOpen, onClose }) => {
  if (!isOpen || !movie) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
          >
            <X size={20} />
          </button>

          {/* Movie Backdrop */}
          {movie.backdropPath && (
            <div className="relative h-64 sm:h-80">
              <img
                src={movie.backdropPath}
                alt={movie.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={movie.posterPath || '/images/no-poster.png'}
                  alt={movie.title}
                  className="w-48 h-72 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{movie.title}</h2>
                
                {movie.tagline && (
                  <p className="text-gray-600 italic mb-4">{movie.tagline}</p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  {movie.voteAverage && (
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="font-semibold">{movie.voteAverage.toFixed(1)}</span>
                    </div>
                  )}
                  
                  {movie.runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span>{movie.runtime} min</span>
                    </div>
                  )}
                  
                  {movie.releaseDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span>{new Date(movie.releaseDate).getFullYear()}</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Overview</h3>
                  <p className="text-gray-700 leading-relaxed">{movie.overview}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Play size={20} />
                    Watch Trailer
                  </button>
                  <button className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                    Add to Watchlist
                  </button>
                </div>
              </div>
            </div>

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Cast</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {movie.cast.slice(0, 6).map((actor, index) => (
                    <div key={index} className="text-center">
                      <img
                        src={actor.profilePath || '/images/avatar-placeholder.png'}
                        alt={actor.name}
                        className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                      />
                      <p className="text-sm font-medium">{actor.name}</p>
                      <p className="text-xs text-gray-600">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieModal
