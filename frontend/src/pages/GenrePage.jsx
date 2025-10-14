import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMovies } from '../context/MovieContext'
import movieService from '../services/movieService'
import MovieGrid from '../components/movie/MovieGrid'
import { getGenreEmoji } from '../utils/helpers'

const GenrePage = () => {
  const { genre } = useParams()
  const { watchlist, addToWatchlist, removeFromWatchlist } = useMovies()
  const [genreMovies, setGenreMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Convert genre slug back to proper genre name
  const getGenreName = (slug) => {
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  useEffect(() => {
    const fetchGenreMovies = async () => {
      setLoading(true)
      setError(null)
      try {
        const genreName = getGenreName(genre)
        console.log('Fetching movies for genre:', genreName)
        const response = await movieService.getMoviesByGenre(genreName, 1)
        setGenreMovies(response.movies || [])
        console.log('Genre movies response:', response)
      } catch (err) {
        console.error('Error fetching genre movies:', err)
        setError('Failed to load movies for this genre')
        setGenreMovies([])
      } finally {
        setLoading(false)
      }
    }

    if (genre) {
      fetchGenreMovies()
    }
  }, [genre])

  const handleAddToWatchlist = (movie) => {
    addToWatchlist(movie)
  }

  const handleRemoveFromWatchlist = (movieId) => {
    removeFromWatchlist(movieId)
  }

  const isInWatchlist = (movieId) => {
    return watchlist.some(movie => (movie.id || movie.tmdbId) === movieId)
  }

  const genreName = getGenreName(genre)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <span className="mr-3">{getGenreEmoji(genreName)}</span>
            {genreName} Movies
          </h1>
          <p className="text-xl text-gray-300">
            {loading ? 'Loading...' : error ? error : `${genreMovies.length} movies found`}
          </p>
          {error && (
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
        
        <MovieGrid
          movies={genreMovies}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          isInWatchlist={isInWatchlist}
          loading={loading}
          emptyMessage={`No ${genreName} movies found`}
        />
      </div>
    </div>
  )
}

export default GenrePage
