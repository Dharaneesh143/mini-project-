import { useState, useEffect } from 'react'
import { useDebounce } from './useDebounce'
import movieService from '../services/movieService'

export const useSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const debouncedQuery = useDebounce(query, 300)

  // Search function using actual API
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const searchResults = await movieService.searchMovies(searchQuery, 1)
      setResults(searchResults.movies || [])
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search movies. Please try again.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Perform search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery)
  }, [debouncedQuery])

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setError(null)
    setHasSearched(false)
  }

  const searchMovies = (searchQuery) => {
    setQuery(searchQuery)
  }

  return {
    query,
    results,
    isLoading,
    error,
    hasSearched,
    setQuery,
    clearSearch,
    searchMovies,
    performSearch
  }
}
