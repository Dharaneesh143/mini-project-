import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import GenreDropdown from './movie/GenreDropdown'
import Button from './common/Button'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useApp()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState([])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const navigationItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/trending', label: 'Trending', icon: '🔥' },
    { path: '/discover', label: 'Discover', icon: '🔍' },
    { path: '/recommendations', label: 'For You', icon: '🎯' },
    { path: '/ai-recommendations', label: 'AI Chat', icon: '🤖' },
    { path: '/watchlist', label: 'Watchlist', icon: '📋' }
  ]

  const handleGenreChange = (genres) => {
    setSelectedGenres(genres)
    // In a real app, you might navigate or filter based on this.
    // For now, we just close the menu.
    if (isMenuOpen) setIsMenuOpen(false)
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎬</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                MovieRecs
              </span>
            </Link>
          </div>

          <div className="flex-1 flex justify-end md:justify-between items-center">
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <GenreDropdown selectedGenres={selectedGenres} onChange={handleGenreChange} />
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                      <span className="text-sm font-medium text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden sm:block text-gray-700 dark:text-gray-300">{user?.name}</span>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                      <Link to="/quiz" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Take Quiz</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/login')}>Login</Button>
                </div>
              )}

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 dark:text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="space-y-2">
              <div className="px-4">
                <GenreDropdown selectedGenres={selectedGenres} onChange={handleGenreChange} />
              </div>

              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div className="px-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {isAuthenticated ? (
                  <div className="space-y-2">
                     <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                     <Link to="/quiz" className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md" onClick={() => setIsMenuOpen(false)}>Take Quiz</Link>
                     <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Logout</button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      navigate('/login')
                      setIsMenuOpen(false)
                    }}
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
