// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  TIMEOUT: 10000
}

// TMDB API Configuration
export const TMDB_CONFIG = {
  API_KEY: import.meta.env.VITE_TMDB_API_KEY,
  IMAGE_SIZES: {
    POSTER: {
      SMALL: 'w185',
      MEDIUM: 'w342',
      LARGE: 'w500',
      XLARGE: 'w780'
    },
    BACKDROP: {
      SMALL: 'w300',
      MEDIUM: 'w780',
      LARGE: 'w1280',
      XLARGE: 'w1920'
    }
  }
}

// App Configuration
export const APP_CONFIG = {
  NAME: 'MovieRecommendation',
  VERSION: '1.0.0',
  DESCRIPTION: 'AI-powered movie recommendation system',
  DEFAULT_PAGE_SIZE: 20,
  MAX_WATCHLIST_ITEMS: 100,
  SEARCH_DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  WATCHLIST: 'watchlist',
  QUIZ_RESULTS: 'quizResults',
  THEME: 'theme',
  LANGUAGE: 'language',
  RECENT_SEARCHES: 'recentSearches'
}

// Movie Rating Systems
export const RATING_SYSTEMS = {
  IMDB: 'imdb',
  ROTTEN_TOMATOES: 'rotten_tomatoes',
  METACRITIC: 'metacritic',
  USER: 'user'
}

// Movie Status
export const MOVIE_STATUS = {
  WATCHED: 'watched',
  WANT_TO_WATCH: 'want_to_watch',
  WATCHING: 'watching',
  ABANDONED: 'abandoned'
}

// Recommendation Types
export const RECOMMENDATION_TYPES = {
  COLLABORATIVE: 'collaborative',
  CONTENT_BASED: 'content_based',
  HYBRID: 'hybrid',
  TRENDING: 'trending',
  SIMILAR: 'similar',
  PERSONALITY: 'personality'
}

// Quiz Types
export const QUIZ_TYPES = {
  PERSONALITY: 'personality',
  PREFERENCE: 'preference',
  MOOD: 'mood'
}

// Chatbot Configuration
export const CHATBOT_CONFIG = {
  MAX_MESSAGES: 50,
  TYPING_DELAY: 1000,
  RESPONSE_DELAY: 500,
  WELCOME_MESSAGE: "Hi! I'm your movie recommendation assistant. How can I help you today?",
  ERROR_MESSAGE: "Sorry, I'm having trouble understanding. Could you please rephrase that?"
}

// Theme Configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
}

// Language Configuration
export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  PT: 'pt',
  RU: 'ru',
  JA: 'ja',
  KO: 'ko',
  ZH: 'zh'
}

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
}

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  REGISTER_SUCCESS: 'Account created successfully!',
  MOVIE_ADDED: 'Movie added to watchlist!',
  MOVIE_REMOVED: 'Movie removed from watchlist!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  QUIZ_COMPLETED: 'Quiz completed! Check your recommendations.'
}

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  MOVIE_TITLE_MAX_LENGTH: 100,
  REVIEW_MAX_LENGTH: 500
}

// Default Values
export const DEFAULTS = {
  AVATAR: '/images/avatar-placeholder.png',
  POSTER: '/images/no-poster.png',
  BACKDROP: '/images/hero-bg.jpg',
  RATING: 0,
  PAGE: 1,
  SORT_BY: 'popularity',
  ORDER: 'desc'
}
