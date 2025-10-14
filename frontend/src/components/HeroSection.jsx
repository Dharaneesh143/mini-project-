import React, { useState } from 'react'
import { Play, Star, TrendingUp } from 'lucide-react'
import SearchBar from './common/SearchBar'

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Search Bar at Top */}
        <div className="max-w-md mx-auto mb-12">
          <SearchBar
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3 mb-8">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">AI-Powered Movie Discovery</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Discover Your Next
            <br />
            Favorite Movie
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Personalized recommendations powered by AI. Explore thousands of movies tailored just for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3">
              <Play className="w-6 h-6" />
              <span>Start Exploring</span>
            </button>

            <button className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:bg-gray-700/50 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-3">
              <TrendingUp className="w-6 h-6" />
              <span>View Trending</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">12,500+</div>
              <div className="text-gray-400">Movies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">500K+</div>
              <div className="text-gray-400">Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">4.8★</div>
              <div className="text-gray-400">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
