import React, { createContext, useContext, useReducer } from 'react'

// Initial state
const initialState = {
  theme: 'dark',
  isLoading: false,
  error: null,
  notifications: []
}

// Action types
const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  TOGGLE_THEME: 'TOGGLE_THEME'
}

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case APP_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }
    
    case APP_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
    
    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      }
    
    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    
    case APP_ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark'
      }
    
    default:
      return state
  }
}

// Context
const AppContext = createContext()

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const actions = {
    setLoading: (loading) => dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: APP_ACTIONS.CLEAR_ERROR }),
    addNotification: (notification) => dispatch({ 
      type: APP_ACTIONS.ADD_NOTIFICATION, 
      payload: { ...notification, id: Date.now() }
    }),
    removeNotification: (id) => dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: id }),
    toggleTheme: () => dispatch({ type: APP_ACTIONS.TOGGLE_THEME })
  }

  return (
    <AppContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook
export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext
