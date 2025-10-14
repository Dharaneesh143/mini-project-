import React from 'react'
import { Link } from 'react-router-dom'

const EmptyWatchlist = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-8xl mb-6">📋</div>
        <h1 className="text-3xl font-bold mb-4">Your Watchlist is Empty</h1>
        <p className="text-gray-400 mb-8 text-lg">
          Start building your watchlist by adding movies you want to watch later.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse Movies
          </Link>
          
          <div className="text-gray-500">
            or
          </div>
          
          <Link
            to="/recommendations"
            className="inline-block bg-transparent border-2 border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Get Recommendations
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>💡 Tip: Click the heart icon on any movie to add it to your watchlist!</p>
        </div>
      </div>
    </div>
  )
}

export default EmptyWatchlist
