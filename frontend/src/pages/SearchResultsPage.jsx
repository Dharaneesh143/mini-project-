import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMovies } from '../context/MovieContext'
import { useSearch } from '../hooks/useSearch'
import MovieGrid from '../components/movie/MovieGrid'

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const { watchlist, addToWatchlist, removeFromWatchlist } = useMovies()
  const query = searchParams.get('q') || ''

  const { results: searchResults, isLoading: loading, error, hasSearched } = useSearch(query)

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {query ? `Search Results for "${query}"` : 'Search Movies'}
          </h1>
          <p className="text-gray-400">
            {loading ? 'Searching...' : `${searchResults.length} results found`}
          </p>
        </div>
        
        {query ? (
          <MovieGrid
            movies={searchResults}
            onAddToWatchlist={handleAddToWatchlist}
            onRemoveFromWatchlist={handleRemoveFromWatchlist}
            isInWatchlist={isInWatchlist}
            loading={loading}
            emptyMessage={`No movies found for "${query}"`}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-4">Search for Movies</h2>
            <p className="text-gray-400">Use the search bar to find your favorite movies</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResultsPage
