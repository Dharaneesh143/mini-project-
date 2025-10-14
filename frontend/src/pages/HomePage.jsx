import React, { useState } from 'react'
import { Star, TrendingUp, Clock, Sparkles, MessageCircle, Brain, Filter, X, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/layout/Container'
import Hero from '../components/layout/Hero'
import Section from '../components/layout/Section'
import SearchBar from '../components/common/SearchBar'
import GenreFilter from '../components/movie/GenreFilter'
import MovieGrid from '../components/movie/MovieGrid'
import MovieModal from '../components/movie/MovieModal'
import ChatBot from '../components/chatbot/ChatBot'
import PersonalityQuiz from '../components/recommendations/PersonalityQuiz'
import ErrorMessage from '../components/common/ErrorMessage'
import { useApp } from '../context/AppContext'
import { useWatchlist } from '../hooks/useWatchlist'
import { useSearch } from '../hooks/useSearch'
import { useRecommendations } from '../hooks/useRecommendations'
import { filterMoviesByGenre, sortMoviesByRating } from '../utils/movieUtils'
import { getTimeBasedMovieDuration, isWeekend } from '../utils/helpers'

const HomePage = () => {
  const navigate = useNavigate()
  const { user } = useApp()
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const [isQuizOpen, setIsQuizOpen] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('popular')

  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const { query, setQuery, results, clearSearch, error: searchError } = useSearch('')

  // Pass query and setQuery to SearchBar for controlled input
  const { recommendations, trending, timeBased, newReleases, error: recError } = useRecommendations()

  const openMovieModal = (movie) => {
    setSelectedMovie(movie)
    setIsModalOpen(true)
  }

  // Apply filters
  let filteredResults = filterMoviesByGenre(results, selectedGenre)

  // Apply sorting
  if (sortBy === 'rating') {
    filteredResults = sortMoviesByRating(filteredResults)
  } else if (sortBy === 'year') {
    filteredResults = [...filteredResults].sort((a, b) =>
      new Date(b.release_date) - new Date(a.release_date)
    )
  }

  const timeInfo = getTimeBasedMovieDuration()
  const isWeekendDay = isWeekend()

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-30 -z-20"></div>

      {/* Floating Glow Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="w-72 h-72 bg-purple-500/30 rounded-full blur-3xl absolute top-20 left-10 animate-pulse"></div>
        <div className="w-96 h-96 bg-pink-500/30 rounded-full blur-3xl absolute bottom-20 right-10 animate-bounce"></div>
        <div className="w-80 h-80 bg-blue-500/20 rounded-full blur-3xl absolute top-1/3 right-1/3 animate-spin-slow"></div>
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        <Container className="py-8">
          {/* Hero Section */}
          <Hero backgroundImage={trending[0]?.backdrop || null} />

          {/* CTA Buttons */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => (user ? setIsQuizOpen(true) : navigate('/login'))}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
            >
              <Sparkles className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold text-lg">Get Personalized</div>
                <div className="text-sm opacity-90">Take the quiz</div>
              </div>
            </button>

            <button
              onClick={() => setIsChatbotOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white p-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
            >
              <MessageCircle className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold text-lg">Ask Assistant</div>
                <div className="text-sm opacity-90">Get movie help</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/trending')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-3"
            >
              <TrendingUp className="w-6 h-6" />
              <div className="text-left">
                <div className="font-bold text-lg">Trending Now</div>
                <div className="text-sm opacity-90">Popular movies</div>
              </div>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <SearchBar
                value={query}
                onChange={setQuery}
                onClear={clearSearch}
                placeholder="Search for movies..."
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-800/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-700 dark:border-gray-600 hover:bg-gray-700/50 dark:hover:bg-gray-700/50 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {showFilters && (
              <div className="bg-gray-800/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-700 dark:border-gray-600 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white dark:text-gray-100 font-semibold text-lg">Advanced Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="text-gray-300 dark:text-gray-400 text-sm font-medium mb-2 block">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-gray-700 dark:bg-gray-600 text-white dark:text-gray-100 px-4 py-2 rounded-lg border border-gray-600 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="year">Newest First</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <ErrorMessage message={searchError} />

          {/* Genre Filter */}
          <div className="mb-8">
            <h3 className="text-gray-100 font-semibold text-lg mb-4">Browse by Genre</h3>
            <GenreFilter selectedGenre={selectedGenre} onChange={setSelectedGenre} />
          </div>

          {/* Sections */}
          <Section title="Featured Movies" icon={Star}>
            <MovieGrid
              movies={filteredResults.slice(0, 10)}
              onAddToWatchlist={addToWatchlist}
              onRemoveFromWatchlist={removeFromWatchlist}
              isInWatchlist={isInWatchlist}
              onMovieClick={openMovieModal}
            />
          </Section>

          {user && recommendations.length > 0 && (
            <Section title="Recommended for You" icon={Sparkles}>
              <MovieGrid
                movies={recommendations}
                onAddToWatchlist={addToWatchlist}
                onRemoveFromWatchlist={removeFromWatchlist}
                isInWatchlist={isInWatchlist}
                onMovieClick={openMovieModal}
              />
            </Section>
          )}

          <Section title="Trending Now" icon={TrendingUp}>
            <MovieGrid
              movies={trending.slice(0, 5)}
              onAddToWatchlist={addToWatchlist}
              onRemoveFromWatchlist={removeFromWatchlist}
              isInWatchlist={isInWatchlist}
              onMovieClick={openMovieModal}
            />
          </Section>

          <Section title="Perfect for Right Now" icon={Clock}>
            <MovieGrid
              movies={timeBased.slice(0, 5)}
              onAddToWatchlist={addToWatchlist}
              onRemoveFromWatchlist={removeFromWatchlist}
              isInWatchlist={isInWatchlist}
              onMovieClick={openMovieModal}
            />
          </Section>

          <Section title="New Releases" icon={Calendar}>
            <MovieGrid
              movies={newReleases.slice(0, 5)}
              onAddToWatchlist={addToWatchlist}
              onRemoveFromWatchlist={removeFromWatchlist}
              isInWatchlist={isInWatchlist}
              onMovieClick={openMovieModal}
            />
          </Section>

          <Section title="All Movies">
            <MovieGrid
              movies={filteredResults}
              onAddToWatchlist={addToWatchlist}
              onRemoveFromWatchlist={removeFromWatchlist}
              isInWatchlist={isInWatchlist}
              onMovieClick={openMovieModal}
            />
          </Section>
        </Container>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-40">
        <button
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        {user && (
          <button
            onClick={() => setIsQuizOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110"
          >
            <Brain className="w-6 h-6" />
          </button>
        )}

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-gray-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110"
        >
          ↑
        </button>
      </div>

      {/* Modals */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToWatchlist={addToWatchlist}
        onRemoveFromWatchlist={removeFromWatchlist}
        inWatchlist={selectedMovie && isInWatchlist(selectedMovie.id)}
      />

      <PersonalityQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />

      <ChatBot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  )
}

export default HomePage
