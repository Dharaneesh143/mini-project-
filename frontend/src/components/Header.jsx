import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎬</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                MovieApp
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <Link to="/movies" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Movies
            </Link>
            <Link to="/recommendations" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Recommendations
            </Link>
            <Link to="/quiz" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Quiz
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
