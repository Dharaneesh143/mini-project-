import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import movieService from '../services/movieService'
import { useMovies } from '../context/MovieContext'
import MovieCard from '../components/movie/MovieCard'
import { formatRating, formatDuration, formatCurrency } from '../utils/helpers'

const LoadingSpinner = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
)

const NotFound = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Movie Not Found</h1>
      <p className="text-gray-400">The movie you're looking for doesn't exist.</p>
    </div>
  </div>
)

// Basic Movie Information Section
const BasicMovieInfo = ({ movie }) => (
  <div className="bg-gray-800 rounded-lg p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="text-2xl mr-2">🎬</span>
      Basic Movie Information
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div>
          <span className="text-gray-400 font-medium">🎬 Title:</span>
          <p className="text-white text-lg font-semibold">{movie.title}</p>
        </div>
        <div>
          <span className="text-gray-400 font-medium">🗓️ Release Date:</span>
          <p className="text-white">{movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : 'N/A'}</p>
        </div>
        <div>
          <span className="text-gray-400 font-medium">⏳ Runtime:</span>
          <p className="text-white">{movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A'}</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <span className="text-gray-400 font-medium">🏷️ Genres:</span>
          <p className="text-white">{Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genre || 'N/A'}</p>
        </div>
        <div>
          <span className="text-gray-400 font-medium">🇺🇸 Language:</span>
          <p className="text-white">
            {movie.originalLanguage ? movie.originalLanguage.toUpperCase() : 'N/A'}
            {movie.spokenLanguages && movie.spokenLanguages.length > 0 && (
              <span className="text-gray-400 ml-2">
                ({movie.spokenLanguages.join(', ')})
              </span>
            )}
          </p>
        </div>
        <div>
          <span className="text-gray-400 font-medium">🌍 Country:</span>
          <p className="text-white">{movie.productionCountries ? movie.productionCountries.join(', ') : 'N/A'}</p>
        </div>
      </div>
    </div>
  </div>
)

// Ratings & Popularity Section
const RatingsSection = ({ movie }) => (
  <div className="bg-gray-800 rounded-lg p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="text-2xl mr-2">🌟</span>
      Ratings & Popularity
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="text-center">
        <div className="bg-yellow-500 text-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
          <span className="text-2xl font-bold">⭐</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">TMDB Rating</h3>
        <p className="text-3xl font-bold text-yellow-500">{formatRating(movie.voteAverage)}</p>
        <p className="text-gray-400 text-sm">{movie.voteCount ? `${movie.voteCount.toLocaleString()} votes` : 'No votes'}</p>
      </div>
      <div className="text-center">
        <div className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
          <span className="text-2xl font-bold">🔥</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Popularity</h3>
        <p className="text-3xl font-bold text-orange-500">{movie.popularity ? movie.popularity.toFixed(1) : 'N/A'}</p>
        <p className="text-gray-400 text-sm">Trending score</p>
      </div>
      <div className="text-center">
        <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
          <span className="text-2xl font-bold">📊</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">Status</h3>
        <p className="text-lg font-bold text-green-500">{movie.status || 'Unknown'}</p>
        <p className="text-gray-400 text-sm">Release status</p>
      </div>
    </div>
  </div>
)

// Cast & Crew Section
const CastCrewSection = ({ movie }) => (
  <div className="bg-gray-800 rounded-lg p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="text-2xl mr-2">🧑</span>
      Cast & Crew
    </h2>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
          <span className="mr-2">🎥</span>
          Director
        </h3>
        <p className="text-white text-lg">{movie.director || 'N/A'}</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
          <span className="mr-2">✍️</span>
          Writers
        </h3>
        <p className="text-white">{movie.writers && movie.writers.length > 0 ? movie.writers.join(', ') : 'N/A'}</p>
      </div>
    </div>
    
    {movie.cast && movie.cast.length > 0 && (
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
          <span className="mr-2">👨‍🎤</span>
          Main Cast
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {movie.cast.slice(0, 9).map((actor, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-3">
              <p className="text-white font-medium">{actor.name || actor}</p>
              {actor.character && (
                <p className="text-gray-400 text-sm">as {actor.character}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)

// Plot & Description Section
const PlotSection = ({ movie }) => (
  <div className="bg-gray-800 rounded-lg p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="text-2xl mr-2">🧭</span>
      Plot & Description
    </h2>
    {movie.tagline && (
      <div className="mb-4">
        <p className="text-xl italic text-blue-400 text-center">"{movie.tagline}"</p>
      </div>
    )}
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
          <span className="mr-2">📝</span>
          Synopsis
        </h3>
        <p className="text-gray-300 leading-relaxed">
          {movie.overview || movie.description || 'No synopsis available.'}
        </p>
      </div>
    </div>
  </div>
)

// Media Assets Section
const MediaSection = ({ movie }) => (
  <div className="bg-gray-800 rounded-lg p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="text-2xl mr-2">🖼️</span>
      Media Assets
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
          <span className="mr-2">🖼️</span>
          Poster
        </h3>
        <img 
          src={movie.posterPath || movie.poster || movie.posterUrl} 
          alt={`${movie.title} poster`}
          className="w-full max-w-sm rounded-lg shadow-lg"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
          <span className="mr-2">🎞️</span>
          Backdrop
        </h3>
        <img 
          src={movie.backdropPath || movie.backdrop} 
          alt={`${movie.title} backdrop`}
          className="w-full max-w-sm rounded-lg shadow-lg"
        />
      </div>
    </div>
  </div>
)

// Additional Details Section
const AdditionalDetailsSection = ({ movie }) => (
  <div className="bg-gray-800 rounded-lg p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="text-2xl mr-2">💬</span>
      Additional Details
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div>
          <span className="text-gray-400 font-medium">🌍 Country of Origin:</span>
          <p className="text-white">{movie.productionCountries ? movie.productionCountries.join(', ') : 'N/A'}</p>
        </div>
        <div>
          <span className="text-gray-400 font-medium">💰 Budget:</span>
          <p className="text-white">{movie.budget ? formatCurrency(movie.budget) : 'N/A'}</p>
        </div>
        <div>
          <span className="text-gray-400 font-medium">💵 Box Office:</span>
          <p className="text-white">{movie.revenue ? formatCurrency(movie.revenue) : 'N/A'}</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <span className="text-gray-400 font-medium">🏆 Status:</span>
          <p className="text-white">{movie.status || 'N/A'}</p>
        </div>
        <div>
          <span className="text-gray-400 font-medium">🎭 Adult Content:</span>
          <p className="text-white">{movie.adult ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <span className="text-gray-400 font-medium">🆔 Movie ID:</span>
          <p className="text-white font-mono">{movie.tmdbId || movie.id}</p>
        </div>
      </div>
    </div>
  </div>
)

// Keywords Section
const KeywordsSection = ({ movie }) => (
  <div className="bg-gray-800 rounded-lg p-6 mb-6">
    <h2 className="text-2xl font-bold mb-4 flex items-center">
      <span className="text-2xl mr-2">🧠</span>
      Keywords & Tags
    </h2>
    <div className="flex flex-wrap gap-2">
      {movie.keywords && movie.keywords.length > 0 ? (
        movie.keywords.map((keyword, index) => (
          <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition-colors">
            {keyword}
          </span>
        ))
      ) : (
        <p className="text-gray-400">No keywords available.</p>
      )}
    </div>
  </div>
)

// Movie Details Hero Section
const MovieDetailsHero = ({ movie, isInWatchlist, onAddToWatchlist, onRemoveFromWatchlist }) => (
  <div className="relative h-96 md:h-[500px] overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${movie.backdropPath || movie.backdrop})`
      }}
    ></div>
    <div className="relative z-10 h-full flex items-end">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <img 
              src={movie.posterPath || movie.poster || movie.posterUrl} 
              alt={movie.title} 
              className="w-48 md:w-64 h-72 md:h-96 object-cover rounded-lg shadow-2xl" 
            />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-xl text-blue-400 italic mb-4">"{movie.tagline}"</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                ⭐ {formatRating(movie.voteAverage)}
              </span>
              <span className="text-gray-300">
                {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
              </span>
              <span className="text-gray-300">
                {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A'}
              </span>
              <span className="text-gray-300">
                {Array.isArray(movie.genres) ? movie.genres.join(', ') : 'N/A'}
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={isInWatchlist ? onRemoveFromWatchlist : onAddToWatchlist} 
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isInWatchlist 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const MovieDetailsPage = () => {
  const { id } = useParams()
  const { watchlist, addToWatchlist, removeFromWatchlist } = useMovies()
  const [movie, setMovie] = useState(null)
  const [similarMovies, setSimilarMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true)
      try {
        console.log('Fetching movie details for ID:', id)
        const rawMovieData = await movieService.getMovieDetails(id)
        console.log('Raw movie data:', rawMovieData)
        
        // Normalize movie data
        const normalizedMovie = {
          ...rawMovieData,
          id: rawMovieData.id || rawMovieData.tmdbId,
          tmdbId: rawMovieData.tmdbId || rawMovieData.id,
          title: rawMovieData.title,
          overview: rawMovieData.overview || rawMovieData.description,
          posterPath: rawMovieData.posterPath,
          backdropPath: rawMovieData.backdropPath,
          voteAverage: rawMovieData.voteAverage || rawMovieData.rating,
          releaseDate: rawMovieData.releaseDate,
          runtime: rawMovieData.runtime,
          genres: rawMovieData.genres || [],
          originalLanguage: rawMovieData.originalLanguage,
          spokenLanguages: rawMovieData.spokenLanguages || [],
          productionCountries: rawMovieData.productionCountries || [],
          popularity: rawMovieData.popularity,
          voteCount: rawMovieData.voteCount,
          tagline: rawMovieData.tagline,
          status: rawMovieData.status,
          adult: rawMovieData.adult,
          director: rawMovieData.director,
          writers: rawMovieData.writers || [],
          cast: rawMovieData.cast || [],
          budget: rawMovieData.budget,
          revenue: rawMovieData.revenue,
          keywords: rawMovieData.keywords || []
        }
        
        setMovie(normalizedMovie)
        console.log('Normalized movie data:', normalizedMovie)

        // Fetch similar movies
        try {
          const similar = await movieService.getSimilarMovies(id, 4)
          setSimilarMovies(similar.movies || [])
        } catch (similarError) {
          console.error('Error fetching similar movies:', similarError)
          setSimilarMovies([])
        }
      } catch (error) {
        console.error("Failed to fetch movie details:", error)
        setMovie(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchMovie()
    }
  }, [id])

  const handleAddToWatchlist = () => {
    addToWatchlist(movie)
  }

  const handleRemoveFromWatchlist = () => {
    removeFromWatchlist(movie.id || movie.tmdbId)
  }

  const isInWatchlist = watchlist.some(m => (m.id || m.tmdbId) === (movie?.id || movie?.tmdbId))

  if (loading) {
    return <LoadingSpinner />
  }

  if (!movie) {
    return <NotFound />
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <MovieDetailsHero
        movie={movie}
        isInWatchlist={isInWatchlist}
        onAddToWatchlist={handleAddToWatchlist}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
      />

      {/* Movie Details Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <BasicMovieInfo movie={movie} />
            <RatingsSection movie={movie} />
            <CastCrewSection movie={movie} />
            <PlotSection movie={movie} />
            <MediaSection movie={movie} />
            <AdditionalDetailsSection movie={movie} />
            <KeywordsSection movie={movie} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-gray-800 rounded-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating:</span>
                  <span className="text-yellow-500 font-bold">{formatRating(movie.voteAverage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Year:</span>
                  <span className="text-white">
                    {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Runtime:</span>
                  <span className="text-white">
                    {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Popularity:</span>
                  <span className="text-orange-500 font-bold">{movie.popularity ? movie.popularity.toFixed(1) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Votes:</span>
                  <span className="text-white">{movie.voteCount ? movie.voteCount.toLocaleString() : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center">
              <span className="mr-3">🧭</span>
              Similar Movies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarMovies.map((similarMovie) => (
                <MovieCard
                  key={similarMovie.id || similarMovie.tmdbId}
                  movie={similarMovie}
                  onAddToWatchlist={addToWatchlist}
                  onRemoveFromWatchlist={removeFromWatchlist}
                  isInWatchlist={watchlist.some(m => (m.id || m.tmdbId) === (similarMovie.id || similarMovie.tmdbId))}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieDetailsPage