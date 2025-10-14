import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import movieService from '../services/movieService'
import { useMovies } from '../context/MovieContext'
import MovieCard from '../components/movie/MovieCard'
import { formatRating, formatDuration } from '../utils/helpers'

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

const MovieDetailsHero = ({ movie, isInWatchlist, onAddToWatchlist, onRemoveFromWatchlist }) => (
  <div className="relative h-96 md:h-[500px] overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${movie.backdropUrl})`
      }}
    ></div>
    <div className="relative z-10 h-full flex items-end">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <img src={movie.posterUrl} alt={movie.title} className="w-48 md:w-64 h-72 md:h-96 object-cover rounded-lg shadow-2xl" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">⭐ {movie.rating}</span>
              <span className="text-gray-300">{movie.year}</span>
              <span className="text-gray-300">{movie.genres}</span>
              <span className="text-gray-300">{movie.duration}</span>
              <span className="text-gray-300">Language: {movie.language}</span>
            </div>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">{movie.overview}</p>
            <div className="flex flex-wrap gap-4">
              <button onClick={isInWatchlist ? onRemoveFromWatchlist : onAddToWatchlist} className={`px-6 py-3 rounded-lg font-semibold transition-colors ${isInWatchlist ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>{isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">Watch Trailer</button>
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
        const rawMovieData = await movieService.getMovieDetails(id)
        // Normalize movie data
        const normalizedMovie = {
          ...rawMovieData,
          id: rawMovieData.id,
          title: rawMovieData.title,
          overview: rawMovieData.overview || rawMovieData.description || rawMovieData.plot,
          posterUrl: rawMovieData.posterPath || rawMovieData.poster || 'https://via.placeholder.com/300x450/374151/9ca3af?text=No+Poster',
          backdropUrl: rawMovieData.backdropPath || rawMovieData.posterPath || rawMovieData.backdrop || rawMovieData.poster || 'https://via.placeholder.com/1280x720/374151/9ca3af?text=No+Backdrop',
          rating: formatRating(rawMovieData.voteAverage || rawMovieData.rating),
          year: rawMovieData.releaseDate ? new Date(rawMovieData.releaseDate).getFullYear() : rawMovieData.year,
          genres: Array.isArray(rawMovieData.genres) ? rawMovieData.genres.join(', ') : rawMovieData.genre,
          duration: formatDuration(rawMovieData.runtime || rawMovieData.duration),
          language: rawMovieData.originalLanguage ? rawMovieData.originalLanguage.toUpperCase() : 'N/A',
          cast: Array.isArray(rawMovieData.cast) ? rawMovieData.cast.map(c => c.name || c).join(', ') : rawMovieData.cast,
        }
        setMovie(normalizedMovie)

        const similar = await movieService.getSimilarMovies(id, 4)
        setSimilarMovies(similar.movies || [])
      } catch (error) {
        console.error("Failed to fetch movie details:", error)
        setMovie(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  const handleAddToWatchlist = () => {
    addToWatchlist(movie)
  }

  const handleRemoveFromWatchlist = () => {
    removeFromWatchlist(movie.id)
  }

  const isInWatchlist = watchlist.some(m => m.id === movie?.id)

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

      {/* Movie Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cast & Crew */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Cast & Crew</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-blue-400 mb-2">Director</h3>
                  <p className="text-gray-300">{movie.director || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-400 mb-2">Cast</h3>
                  <p className="text-gray-300">{movie.cast || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Movie Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Movie Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Genre:</span>
                  <span className="ml-2 text-white">{movie.genres}</span>
                </div>
                <div>
                  <span className="text-gray-400">Year:</span>
                  <span className="ml-2 text-white">{movie.year}</span>
                </div>
                <div>
                  <span className="text-gray-400">Duration:</span>
                  <span className="ml-2 text-white">{movie.duration}</span>
                </div>
                <div>
                  <span className="text-gray-400">Language:</span>
                  <span className="ml-2 text-white">{movie.language}</span>
                </div>
                <div>
                  <span className="text-gray-400">Rating:</span>
                  <span className="ml-2 text-white">{movie.rating}</span>
                </div>
                {movie.budget && (
                  <div>
                    <span className="text-gray-400">Popularity:</span>
                    <span className="ml-2 text-white">{movie.popularity ? movie.popularity.toFixed(2) : 'N/A'}</span>
                  </div>
                )}
                {movie.budget > 0 && (
                  <div data-testid="budget">
                    <span className="text-gray-400">Budget:</span>
                    <span className="ml-2 text-white">{movie.budget}</span>
                  </div>
                )}
                {movie.revenue > 0 && (
                  <div>
                    <span className="text-gray-400">Box Office:</span>
                    <span className="ml-2 text-white">{movie.revenue}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {movie.keywords && movie.keywords.length > 0 ? (
                  movie.keywords.map((keyword, index) => (
                    <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">{keyword}</span>
                  ))
                ) : (
                  <p className="text-gray-400">No keywords available.</p>
                )}
              </div>
            </div>
            
            {/* Ratings - Conditionally render if external ratings exist */}
            {(movie.imdbRating || movie.rottenTomatoes || movie.metacritic) && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Ratings</h3>
                <div className="space-y-3">
                  {movie.imdbRating && <div className="flex justify-between">
                    <span className="text-gray-400">IMDb:</span>
                    <span className="text-white">{movie.imdbRating}</span>
                  </div>}
                  {movie.rottenTomatoes && <div className="flex justify-between">
                    <span className="text-gray-400">Rotten Tomatoes:</span>
                    <span className="text-white">{movie.rottenTomatoes}%</span>
                  </div>}
                  {movie.metacritic && <div className="flex justify-between">
                    <span className="text-gray-400">Metacritic:</span>
                    <span className="text-white">{movie.metacritic}</span>
                  </div>}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">Similar Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarMovies.map((similarMovie) => (
                <MovieCard
                  key={similarMovie.id}
                  movie={similarMovie}
                  onAddToWatchlist={addToWatchlist}
                  onRemoveFromWatchlist={removeFromWatchlist}
                  isInWatchlist={watchlist.some(m => m.id === similarMovie.id)}
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
