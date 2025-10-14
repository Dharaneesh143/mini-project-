import { useState, useEffect } from 'react'

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist')
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist))
      } catch (error) {
        console.error('Error parsing watchlist from localStorage:', error)
        setWatchlist([])
      }
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const addToWatchlist = (movie) => {
    setWatchlist(prev => {
      const isAlreadyInWatchlist = prev.some(item => item.id === movie.id)
      if (isAlreadyInWatchlist) {
        return prev
      }
      return [...prev, { ...movie, addedAt: new Date().toISOString() }]
    })
  }

  const removeFromWatchlist = (movieId) => {
    setWatchlist(prev => prev.filter(movie => movie.id !== movieId))
  }

  const isInWatchlist = (movieId) => {
    return watchlist.some(movie => movie.id === movieId)
  }

  const toggleWatchlist = (movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id)
    } else {
      addToWatchlist(movie)
    }
  }

  const clearWatchlist = () => {
    setWatchlist([])
  }

  const getWatchlistCount = () => {
    return watchlist.length
  }

  const getWatchlistByGenre = (genre) => {
    return watchlist.filter(movie => 
      movie.genres && movie.genres.includes(genre)
    )
  }

  return {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    clearWatchlist,
    getWatchlistCount,
    getWatchlistByGenre
  }
}
