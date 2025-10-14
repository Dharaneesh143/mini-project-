export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// Format date string to readable format
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Get year from date string
export const getYearFromDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).getFullYear()
}

// Truncate text to specific length
export const truncateText = (text, maxLength = 150) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Generate movie slug for URLs
export const generateMovieSlug = (title, id) => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug}-${id}`
}

// Get image URL from TMDB
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/no-poster.png'
  return `https://image.tmdb.org/t/p/${size}${path}`
}

// Get rating color based on score
export const getRatingColor = (rating) => {
  if (rating >= 8) return 'text-green-400'
  if (rating >= 6) return 'text-yellow-400'
  if (rating >= 4) return 'text-orange-400'
  return 'text-red-400'
}

// Get rating as percentage
export const getRatingPercentage = (rating) => {
  return Math.round(rating * 10)
}

// Format rating for display
export const formatRating = (rating) => {
  return `${getRatingPercentage(rating)}%`
}

// Format duration for display
export const formatDuration = (minutes) => {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

// Get current time of day
export const getCurrentTimeOfDay = () => {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 24) return 'evening'
  return 'night'
}

// Check if today is weekend
export const isWeekend = () => {
  const day = new Date().getDay()
  return day === 0 || day === 6
}

// Get time-based movie duration recommendations
export const getTimeBasedMovieDuration = () => {
  const hour = new Date().getHours()
  const isWeekendDay = isWeekend()
  
  if (isWeekendDay || hour >= 18) {
    return { 
      min: 120, 
      max: 300, 
      label: 'Perfect time for epic adventures and long movies!' 
    }
  } else {
    return { 
      min: 80, 
      max: 120, 
      label: 'Quick entertainment that fits your busy schedule' 
    }
  }
}

// Calculate similarity score between two movies
export const calculateSimilarityScore = (movie1, movie2) => {
  let score = 0
  
  // Genre similarity
  const commonGenres = movie1.genres.filter(g => movie2.genres.includes(g))
  score += commonGenres.length * 20
  
  // Rating similarity
  const ratingDiff = Math.abs(movie1.rating - movie2.rating)
  score += Math.max(0, 20 - (ratingDiff * 10))
  
  // Release year proximity
  const year1 = new Date(movie1.release_date).getFullYear()
  const year2 = new Date(movie2.release_date).getFullYear()
  const yearDiff = Math.abs(year1 - year2)
  score += Math.max(0, 20 - yearDiff)
  
  return score
}

// Shuffle array randomly
export const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Get random items from array
export const getRandomItems = (array, count) => {
  const shuffled = shuffleArray(array)
  return shuffled.slice(0, count)
}

// Debounce function for search inputs
export const debounce = (func, delay = 300) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Validate email format
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate password strength
export const validatePassword = (password) => {
  return password.length >= 6
}

// Get emoji for each genre (THIS WAS MISSING!)
export const getGenreEmoji = (genre) => {
  const emojiMap = {
    'Action': '💥',
    'Adventure': '🗺️',
    'Animation': '🎨',
    'Comedy': '😂',
    'Crime': '🔫',
    'Documentary': '📹',
    'Drama': '🎭',
    'Family': '👨‍👩‍👧‍👦',
    'Fantasy': '🧙',
    'History': '📜',
    'Horror': '👻',
    'Music': '🎵',
    'Mystery': '🔍',
    'Romance': '❤️',
    'Sci-Fi': '🚀',
    'Thriller': '😱',
    'War': '⚔️',
    'Western': '🤠'
  }
  return emojiMap[genre] || '🎬'
}

// Format number with commas (for views, likes, etc.)
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Format currency for display
export const formatCurrency = (amount) => {
  if (!amount || amount === 0) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Get time ago from timestamp
export const getTimeAgo = (timestamp) => {
  const now = new Date()
  const past = new Date(timestamp)
  const diffInSeconds = Math.floor((now - past) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return formatDate(timestamp)
}

// Check if value is empty
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

// Generate random ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Get file size in readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}