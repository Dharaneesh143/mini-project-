import React, { useState, useEffect } from 'react'
import { Filter, X, ChevronDown } from 'lucide-react'
import movieService from '../../services/movieService'

const MovieFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [genres, setGenres] = useState([])
  const [languages, setLanguages] = useState([])
  const [filters, setFilters] = useState({
    genre: initialFilters.genre || '',
    language: initialFilters.language || '',
    rating: initialFilters.rating || '',
    runtime: initialFilters.runtime || '',
    sortBy: initialFilters.sortBy || 'popularity',
    ...initialFilters
  })

  // Load available genres and languages
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await movieService.getGenres()
        setGenres(genreData || [])
      } catch (error) {
        console.error('Error loading genres:', error)
      }
    }

    const loadLanguages = async () => {
      // Common languages for movies
      const commonLanguages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'zh', name: 'Chinese' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ar', name: 'Arabic' }
      ]
      setLanguages(commonLanguages)
    }

    loadGenres()
    loadLanguages()
  }, [])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      genre: '',
      language: '',
      rating: '',
      runtime: '',
      sortBy: 'popularity'
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value && value !== '' && value !== 'popularity'
  )

  const getRuntimeLabel = (runtime) => {
    const labels = {
      'short': 'Under 90 min',
      'medium': '90-120 min',
      'long': '120-180 min',
      'very-long': 'Over 180 min'
    }
    return labels[runtime] || runtime
  }

  const getRatingLabel = (rating) => {
    const labels = {
      'high': '8.0+ Rating',
      'good': '7.0+ Rating',
      'average': '6.0+ Rating',
      'any': 'Any Rating'
    }
    return labels[rating] || rating
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
      {/* Filter Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-white">Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {Object.values(filters).filter(v => v && v !== '' && v !== 'popularity').length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearFilters()
              }}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear All
            </button>
          )}
          <ChevronDown className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Filter Content */}
      {isOpen && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-6">
          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genre
            </label>
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Languages</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Rating
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'any', label: 'Any Rating' },
                { value: 'average', label: '6.0+' },
                { value: 'good', label: '7.0+' },
                { value: 'high', label: '8.0+' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('rating', option.value)}
                  className={`p-2 text-sm rounded-md border transition-colors ${
                    filters.rating === option.value
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Runtime Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Runtime
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: '', label: 'Any Length' },
                { value: 'short', label: 'Under 90 min' },
                { value: 'medium', label: '90-120 min' },
                { value: 'long', label: '120-180 min' },
                { value: 'very-long', label: 'Over 180 min' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange('runtime', option.value)}
                  className={`p-2 text-sm rounded-md border transition-colors ${
                    filters.runtime === option.value
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="runtime">Runtime</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {filters.genre && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Genre: {genres.find(g => g.id === filters.genre)?.name || filters.genre}
                    <button
                      onClick={() => handleFilterChange('genre', '')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.language && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Language: {languages.find(l => l.code === filters.language)?.name || filters.language}
                    <button
                      onClick={() => handleFilterChange('language', '')}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.rating && filters.rating !== 'any' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Rating: {getRatingLabel(filters.rating)}
                    <button
                      onClick={() => handleFilterChange('rating', '')}
                      className="ml-2 text-yellow-600 hover:text-yellow-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.runtime && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Runtime: {getRuntimeLabel(filters.runtime)}
                    <button
                      onClick={() => handleFilterChange('runtime', '')}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MovieFilters
