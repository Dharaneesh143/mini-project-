import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMovies } from '../context/MovieContext'
import { getMoviesByGenre } from '../utils/movieUtils'
import MovieGrid from '../components/movie/MovieGrid'

const GenrePage = () => {
  const { genre } = useParams()
  const { watchlist, addToWatchlist, removeFromWatchlist } = useMovies()
  const [genreMovies, setGenreMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const movies = getMoviesByGenre(genre)
    setGenreMovies(movies)
    setLoading(false)
  }, [genre])

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
          <h1 className="text-4xl font-bold mb-4 capitalize">
            {genre} Movies
          </h1>
          <p className="text-xl text-gray-300">
            {loading ? 'Loading...' : `${genreMovies.length} movies found`}
          </p>
        </div>
        
        <MovieGrid
          movies={genreMovies}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          isInWatchlist={isInWatchlist}
          loading={loading}
          emptyMessage={`No ${genre} movies found`}
        />
      </div>
    </div>
  )
}

export default GenrePage
