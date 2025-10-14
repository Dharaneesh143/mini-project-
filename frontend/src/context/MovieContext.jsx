import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Initial state
const initialState = {
  movies: [],
  watchlist: [],
  recommendations: [],
  searchResults: [],
  currentMovie: null,
  isLoading: false,
  error: null,
  filters: {
    genre: '',
    year: '',
    rating: '',
    sortBy: 'popularity'
  }
}

// Action types
const MOVIE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_MOVIES: 'SET_MOVIES',
  SET_CURRENT_MOVIE: 'SET_CURRENT_MOVIE',
  ADD_TO_WATCHLIST: 'ADD_TO_WATCHLIST',
  REMOVE_FROM_WATCHLIST: 'REMOVE_FROM_WATCHLIST',
  SET_WATCHLIST: 'SET_WATCHLIST',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// Reducer
const movieReducer = (state, action) => {
  switch (action.type) {
    case MOVIE_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case MOVIE_ACTIONS.SET_MOVIES:
      return { ...state, movies: action.payload, isLoading: false }
    
    case MOVIE_ACTIONS.SET_CURRENT_MOVIE:
      return { ...state, currentMovie: action.payload }
    
    case MOVIE_ACTIONS.ADD_TO_WATCHLIST:
      const movieToAdd = action.payload
      const isAlreadyInWatchlist = state.watchlist.some(movie => movie.id === movieToAdd.id)
      
      if (isAlreadyInWatchlist) {
        return state
      }
      
      const newWatchlist = [...state.watchlist, movieToAdd]
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist))
      return { ...state, watchlist: newWatchlist }
    
    case MOVIE_ACTIONS.REMOVE_FROM_WATCHLIST:
      const movieIdToRemove = action.payload
      const updatedWatchlist = state.watchlist.filter(movie => movie.id !== movieIdToRemove)
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist))
      return { ...state, watchlist: updatedWatchlist }
    
    case MOVIE_ACTIONS.SET_WATCHLIST:
      return { ...state, watchlist: action.payload }
    
    case MOVIE_ACTIONS.SET_RECOMMENDATIONS:
      return { ...state, recommendations: action.payload }
    
    case MOVIE_ACTIONS.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload }
    
    case MOVIE_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } }
    
    case MOVIE_ACTIONS.CLEAR_FILTERS:
      return { ...state, filters: initialState.filters }
    
    case MOVIE_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }
    
    case MOVIE_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    
    default:
      return state
  }
}

// Context
const MovieContext = createContext()

// Provider component
export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState)

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist')
    if (savedWatchlist) {
      try {
        const watchlist = JSON.parse(savedWatchlist)
        dispatch({ type: MOVIE_ACTIONS.SET_WATCHLIST, payload: watchlist })
      } catch (error) {
        console.error('Failed to load watchlist:', error)
      }
    }
  }, [])

  const actions = {
    setLoading: (loading) => dispatch({ type: MOVIE_ACTIONS.SET_LOADING, payload: loading }),
    setMovies: (movies) => dispatch({ type: MOVIE_ACTIONS.SET_MOVIES, payload: movies }),
    setCurrentMovie: (movie) => dispatch({ type: MOVIE_ACTIONS.SET_CURRENT_MOVIE, payload: movie }),
    addToWatchlist: (movie) => dispatch({ type: MOVIE_ACTIONS.ADD_TO_WATCHLIST, payload: movie }),
    removeFromWatchlist: (movieId) => dispatch({ type: MOVIE_ACTIONS.REMOVE_FROM_WATCHLIST, payload: movieId }),
    setRecommendations: (recommendations) => dispatch({ type: MOVIE_ACTIONS.SET_RECOMMENDATIONS, payload: recommendations }),
    setSearchResults: (results) => dispatch({ type: MOVIE_ACTIONS.SET_SEARCH_RESULTS, payload: results }),
    setFilters: (filters) => dispatch({ type: MOVIE_ACTIONS.SET_FILTERS, payload: filters }),
    clearFilters: () => dispatch({ type: MOVIE_ACTIONS.CLEAR_FILTERS }),
    setError: (error) => dispatch({ type: MOVIE_ACTIONS.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: MOVIE_ACTIONS.CLEAR_ERROR })
  }

  return (
    <MovieContext.Provider value={{ ...state, ...actions }}>
      {children}
    </MovieContext.Provider>
  )
}

// Custom hook
export const useMovies = () => {
  const context = useContext(MovieContext)
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider')
  }
  return context
}

export default MovieContext
